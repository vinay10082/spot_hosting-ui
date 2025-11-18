import { createReducer, on } from '@ngrx/store';
import { EditorActions } from './editor.action';
import { initialEditorState, EditorState } from './editor.state';
import { ComponentInstance } from '../../core/models/component.model';

const MAX_HISTORY = 50;

export const editorReducer = createReducer(
  initialEditorState,

  // Add Component
  on(EditorActions.addComponent, (state, { component, parentId }) => {
    const newComponents = addComponentHelper(state.components, component, parentId);
    return {
      ...state,
      components: newComponents,
      selectedComponentId: component.id,
      history: addToHistory(state.history, state.components, newComponents),
      isDirty: true
    };
  }),

  // Update Component
  on(EditorActions.updateComponent, (state, { id, props }) => {
    const newComponents = updateComponentHelper(state.components, id, props);
    return {
      ...state,
      components: newComponents,
      history: addToHistory(state.history, state.components, newComponents),
      isDirty: true
    };
  }),

  // Delete Component
  on(EditorActions.deleteComponent, (state, { id }) => {
    const newComponents = deleteComponentHelper(state.components, id);
    return {
      ...state,
      components: newComponents,
      selectedComponentId: null,
      history: addToHistory(state.history, state.components, newComponents),
      isDirty: true
    };
  }),

  // Move Component
  on(EditorActions.moveComponent, (state, { id, newParentId, newIndex }) => {
    const component = findComponentById(state.components, id);
    if (!component) return state;
    
    let withoutComponent = deleteComponentHelper(state.components, id);
    const newComponents = addComponentHelper(withoutComponent, { ...component, order: newIndex }, newParentId);
    
    return {
      ...state,
      components: newComponents,
      history: addToHistory(state.history, state.components, newComponents),
      isDirty: true
    };
  }),

  // Duplicate Component
  on(EditorActions.duplicateComponent, (state, { id }) => {
    const component = findComponentById(state.components, id);
    if (!component) return state;

    const duplicated = duplicateComponentHelper(component);
    const newComponents = addComponentHelper(state.components, duplicated);

    return {
      ...state,
      components: newComponents,
      selectedComponentId: duplicated.id,
      history: addToHistory(state.history, state.components, newComponents),
      isDirty: true
    };
  }),

  // Select Component
  on(EditorActions.selectComponent, (state, { id }) => ({
    ...state,
    selectedComponentId: id
  })),

  // Undo
  on(EditorActions.undo, (state) => {
    if (state.history.past.length === 0) return state;

    const previous = state.history.past[state.history.past.length - 1];
    const newPast = state.history.past.slice(0, -1);

    return {
      ...state,
      components: previous,
      history: {
        past: newPast,
        present: previous,
        future: [state.history.present, ...state.history.future]
      },
      isDirty: true
    };
  }),

  // Redo
  on(EditorActions.redo, (state) => {
    if (state.history.future.length === 0) return state;

    const next = state.history.future[0];
    const newFuture = state.history.future.slice(1);

    return {
      ...state,
      components: next,
      history: {
        past: [...state.history.past, state.history.present],
        present: next,
        future: newFuture
      },
      isDirty: true
    };
  }),

  // Set Responsive Mode
  on(EditorActions.setResponsiveMode, (state, { mode }) => ({
    ...state,
    responsiveMode: mode
  })),

  // Load State
  on(EditorActions.loadState, (state, { components }) => ({
    ...state,
    components,
    history: {
      past: [],
      present: components,
      future: []
    },
    isDirty: false
  })),

  // Save State
  on(EditorActions.saveState, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EditorActions.saveStateSuccess, (state) => ({
    ...state,
    loading: false,
    isDirty: false
  })),
  on(EditorActions.saveStateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Utility
  on(EditorActions.clearError, (state) => ({
    ...state,
    error: null
  })),
  on(EditorActions.markClean, (state) => ({
    ...state,
    isDirty: false
  }))
);

// Helper Functions
function addComponentHelper(
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
        children: [...comp.children, { ...component, parentId, order: comp.children.length }]
      };
    }
    if (comp.children.length > 0) {
      return {
        ...comp,
        children: addComponentHelper(comp.children, component, parentId)
      };
    }
    return comp;
  });
}

function updateComponentHelper(
  components: ComponentInstance[],
  id: string,
  props: Record<string, any>
): ComponentInstance[] {
  return components.map(comp => {
    if (comp.id === id) {
      return { ...comp, props: { ...comp.props, ...props } };
    }
    if (comp.children.length > 0) {
      return { ...comp, children: updateComponentHelper(comp.children, id, props) };
    }
    return comp;
  });
}

function deleteComponentHelper(
  components: ComponentInstance[],
  id: string
): ComponentInstance[] {
  return components
    .filter(comp => comp.id !== id)
    .map(comp => ({
      ...comp,
      children: deleteComponentHelper(comp.children, id)
    }));
}

function findComponentById(
  components: ComponentInstance[],
  id: string
): ComponentInstance | null {
  for (const comp of components) {
    if (comp.id === id) return comp;
    if (comp.children.length > 0) {
      const found = findComponentById(comp.children, id);
      if (found) return found;
    }
  }
  return null;
}

function duplicateComponentHelper(component: ComponentInstance): ComponentInstance {
  return {
    ...component,
    id: generateId(),
    children: component.children.map(child => duplicateComponentHelper(child))
  };
}

function generateId(): string {
  return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function addToHistory(
  history: EditorState['history'],
  previousState: ComponentInstance[],
  newState: ComponentInstance[]
): EditorState['history'] {
  const newPast = [...history.past, previousState].slice(-MAX_HISTORY);
  return {
    past: newPast,
    present: newState,
    future: []
  };
}
