import { Injectable, signal, computed, effect } from '@angular/core';
import { ComponentInstance } from '../models/component.model';
import { EditorState, EditorAction, HistoryState } from '../models/editor-state.model';
import { ComponentRegistryService } from './component-registry.service';

const MAX_HISTORY = 50;

@Injectable({
  providedIn: 'root'
})
export class EditorStateService {
  private state = signal<EditorState>({
    components: [],
    selectedComponentId: null,
    history: {
      past: [],
      present: [],
      future: [],
    },
    responsiveMode: 'desktop',
    isDirty: false,
  });

  readonly components = computed(() => this.state().components);
  readonly selectedComponentId = computed(() => this.state().selectedComponentId);
  readonly selectedComponent = computed(() => {
    const id = this.selectedComponentId();
    return id ? this.findComponentById(id) : null;
  });
  readonly responsiveMode = computed(() => this.state().responsiveMode);
  readonly canUndo = computed(() => this.state().history.past.length > 0);
  readonly canRedo = computed(() => this.state().history.future.length > 0);
  readonly isDirty = computed(() => this.state().isDirty);

  constructor(private componentRegistry: ComponentRegistryService) {}

  dispatch(action: EditorAction): void {
    const currentState = this.state();
    let newComponents = [...currentState.components];
    let newSelectedId = currentState.selectedComponentId;
    let updateHistory = true;

    switch (action.type) {
      case 'ADD_COMPONENT':
        newComponents = this.addComponent(newComponents, action.payload.component, action.payload.parentId);
        newSelectedId = action.payload.component.id;
        break;

      case 'UPDATE_COMPONENT':
        newComponents = this.updateComponent(newComponents, action.payload.id, action.payload.props);
        break;

      case 'DELETE_COMPONENT':
        newComponents = this.deleteComponent(newComponents, action.payload.id);
        newSelectedId = null;
        break;

      case 'MOVE_COMPONENT':
        newComponents = this.moveComponent(
          newComponents,
          action.payload.id,
          action.payload.newParentId,
          action.payload.newIndex
        );
        break;

      case 'DUPLICATE_COMPONENT':
        const duplicated = this.duplicateComponent(newComponents, action.payload.id);
        if (duplicated) {
          newComponents = this.addComponent(newComponents, duplicated);
          newSelectedId = duplicated.id;
        }
        break;

      case 'SELECT_COMPONENT':
        newSelectedId = action.payload.id;
        updateHistory = false;
        break;

      case 'UNDO':
        const undoResult = this.undo(currentState.history);
        if (undoResult) {
          this.state.set({
            ...currentState,
            components: undoResult.present,
            history: undoResult,
            isDirty: true,
          });
        }
        return;

      case 'REDO':
        const redoResult = this.redo(currentState.history);
        if (redoResult) {
          this.state.set({
            ...currentState,
            components: redoResult.present,
            history: redoResult,
            isDirty: true,
          });
        }
        return;

      case 'SET_RESPONSIVE_MODE':
        this.state.set({
          ...currentState,
          responsiveMode: action.payload.mode,
        });
        return;

      case 'LOAD_STATE':
        this.state.set({
          ...currentState,
          components: action.payload.components,
          history: {
            past: [],
            present: action.payload.components,
            future: [],
          },
          isDirty: false,
        });
        return;
    }

    const newHistory = updateHistory
      ? this.addToHistory(currentState.history, currentState.components, newComponents)
      : currentState.history;

    this.state.set({
      ...currentState,
      components: newComponents,
      selectedComponentId: newSelectedId,
      history: newHistory,
      isDirty: true,
    });
  }

  private addComponent(
    components: ComponentInstance[],
    component: ComponentInstance,
    parentId?: string
  ): ComponentInstance[] {
    if (!parentId) {
      return [...components, { ...component, order: components.length }];
    }

    return components.map(comp => {
      if (comp.id === parentId) {
        return {
          ...comp,
          children: [...comp.children, { ...component, parentId, order: comp.children.length }],
        };
      }
      if (comp.children.length > 0) {
        return {
          ...comp,
          children: this.addComponent(comp.children, component, parentId),
        };
      }
      return comp;
    });
  }

  private updateComponent(
    components: ComponentInstance[],
    id: string,
    props: Record<string, any>
  ): ComponentInstance[] {
    return components.map(comp => {
      if (comp.id === id) {
        return { ...comp, props: { ...comp.props, ...props } };
      }
      if (comp.children.length > 0) {
        return { ...comp, children: this.updateComponent(comp.children, id, props) };
      }
      return comp;
    });
  }

  private deleteComponent(components: ComponentInstance[], id: string): ComponentInstance[] {
    return components
      .filter(comp => comp.id !== id)
      .map(comp => ({
        ...comp,
        children: this.deleteComponent(comp.children, id),
      }));
  }

  private moveComponent(
    components: ComponentInstance[],
    id: string,
    newParentId: string | undefined,
    newIndex: number
  ): ComponentInstance[] {
    const component = this.findComponentById(id);
    if (!component) return components;

    let withoutComponent = this.deleteComponent(components, id);
    return this.addComponent(withoutComponent, { ...component, order: newIndex }, newParentId);
  }

  private duplicateComponent(components: ComponentInstance[], id: string): ComponentInstance | null {
    const component = this.findComponentById(id);
    if (!component) return null;

    const duplicated: ComponentInstance = {
      ...component,
      id: this.generateId(),
      children: component.children.map(child => this.duplicateComponentRecursive(child)),
    };

    return duplicated;
  }

  private duplicateComponentRecursive(component: ComponentInstance): ComponentInstance {
    return {
      ...component,
      id: this.generateId(),
      children: component.children.map(child => this.duplicateComponentRecursive(child)),
    };
  }

  private findComponentById(id: string, components?: ComponentInstance[]): ComponentInstance | null {
    const searchIn = components || this.components();
    
    for (const comp of searchIn) {
      if (comp.id === id) return comp;
      if (comp.children.length > 0) {
        const found = this.findComponentById(id, comp.children);
        if (found) return found;
      }
    }
    return null;
  }

  private addToHistory(
    history: HistoryState,
    previousState: ComponentInstance[],
    newState: ComponentInstance[]
  ): HistoryState {
    const newPast = [...history.past, previousState].slice(-MAX_HISTORY);
    
    return {
      past: newPast,
      present: newState,
      future: [],
    };
  }

  private undo(history: HistoryState): HistoryState | null {
    if (history.past.length === 0) return null;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    return {
      past: newPast,
      present: previous,
      future: [history.present, ...history.future],
    };
  }

  private redo(history: HistoryState): HistoryState | null {
    if (history.future.length === 0) return null;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    return {
      past: [...history.past, history.present],
      present: next,
      future: newFuture,
    };
  }

  private generateId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
