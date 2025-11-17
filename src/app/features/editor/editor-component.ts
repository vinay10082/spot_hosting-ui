import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { EditorCanvasComponent } from './components/editor-canvas/editor-canvas.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';
import { LayersPanelComponent } from './components/layers-panel/layers-panel.component';
import { EditorStateService } from '../../core/services/editor-state.service';
import { ComponentRegistryService } from '../../core/services/component-registry.service';
import { AutoSaveService } from '../../core/services/auto-save.service';
import { ComponentDefinition } from '../../core/models/component.model';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    EditorCanvasComponent,
    PropertiesPanelComponent,
    LayersPanelComponent,
  ],
  template: `
    <div class="editor-container">
      <div class="editor-header">
        <h2>Core Editor</h2>
        <div class="editor-actions">
          <button 
            [disabled]="!canUndo()"
            (click)="undo()">
            <span class="material-icons">undo</span>
            Undo
          </button>
          <button 
            [disabled]="!canRedo()"
            (click)="redo()">
            <span class="material-icons">redo</span>
            Redo
          </button>
          <button (click)="save()">
            <span class="material-icons">save</span>
            Save
          </button>
        </div>
      </div>

      <div class="editor-content">
        <app-sidebar
          (componentDropped)="onComponentDropped($event)">
        </app-sidebar>

        <app-editor-canvas
          [components]="components()"
          [selectedComponentId]="selectedComponentId()"
          [responsiveMode]="responsiveMode()"
          [connectedDropLists]="['canvas-root']"
          (componentDropped)="onCanvasDropped($event)"
          (componentSelected)="onComponentSelected($event)">
        </app-editor-canvas>

        <app-properties-panel></app-properties-panel>

        <app-layers-panel></app-layers-panel>
      </div>
    </div>
  `,
  styles: [`
    .editor-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #fafafa;
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
    }

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .editor-actions {
      display: flex;
      gap: 8px;
    }

    .editor-actions button {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .editor-actions button:hover:not(:disabled) {
      background: #0056b3;
    }

    .editor-actions button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .material-icons {
      font-size: 18px;
    }

    .editor-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
  `]
})
export class EditorComponent implements OnInit {
  components = this.editorState.components;
  selectedComponentId = this.editorState.selectedComponentId;
  responsiveMode = this.editorState.responsiveMode;
  canUndo = this.editorState.canUndo;
  canRedo = this.editorState.canRedo;

  constructor(
    private editorState: EditorStateService,
    private componentRegistry: ComponentRegistryService,
    private autoSave: AutoSaveService
  ) {}

  ngOnInit(): void {
    // Load saved state if exists
    this.loadState();
  }

  onComponentDropped(event: CdkDragDrop<any>): void {
    if (event.previousContainer !== event.container) {
      const definition = event.item.data as ComponentDefinition;
      const newComponent = this.componentRegistry.createInstance(definition.type);
      
      if (newComponent) {
        this.editorState.dispatch({
          type: 'ADD_COMPONENT',
          payload: { component: newComponent },
        });
      }
    }
  }

  onCanvasDropped(event: CdkDragDrop<any>): void {
    // Handle reordering or moving components within canvas
    if (event.previousContainer === event.container) {
      const component = event.item.data;
      this.editorState.dispatch({
        type: 'MOVE_COMPONENT',
        payload: {
          id: component.id,
          newIndex: event.currentIndex,
        },
      });
    }
  }

  onComponentSelected(id: string): void {
    this.editorState.dispatch({
      type: 'SELECT_COMPONENT',
      payload: { id },
    });
  }

  undo(): void {
    this.editorState.dispatch({ type: 'UNDO' });
  }

  redo(): void {
    this.editorState.dispatch({ type: 'REDO' });
  }

  save(): void {
    this.autoSave.manualSave();
  }

  private loadState(): void {
    // Load from localStorage or API
    const saved = localStorage.getItem('editor-state');
    if (saved) {
      const state = JSON.parse(saved);
      this.editorState.dispatch({
        type: 'LOAD_STATE',
        payload: { components: state.components },
      });
    }
  }
}
