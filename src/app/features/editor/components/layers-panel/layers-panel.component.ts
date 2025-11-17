import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { EditorStateService } from '../../../../core/services/editor-state.service';
import { ComponentInstance } from '../../../../core/models/component.model';
import { TreeViewComponent } from '../../../../shared/components/tree-view/tree-view.component';

@Component({
  selector: 'app-layers-panel',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, TreeViewComponent],
  template: `
    <div class="layers-panel">
      <div class="panel-header">
        <h3>Layers</h3>
        <button class="icon-button" (click)="collapseAll()">
          <span class="material-icons">unfold_less</span>
        </button>
      </div>

      <div class="layers-tree">
        <app-tree-view
          [items]="components()"
          [selectedId]="selectedComponentId()"
          (itemClick)="onSelectComponent($event)"
          (itemDrop)="onItemDrop($event)"
          (itemDuplicate)="onDuplicateComponent($event)"
          (itemDelete)="onDeleteComponent($event)">
        </app-tree-view>
      </div>
    </div>
  `,
  styles: [`
    .layers-panel {
      width: 280px;
      background: white;
      border-left: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .icon-button {
      padding: 4px;
      background: none;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-button:hover {
      background: #f5f5f5;
    }

    .material-icons {
      font-size: 20px;
      color: #666;
    }

    .layers-tree {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
  `]
})
export class LayersPanelComponent {
  components = computed(() => this.editorState.components());
  selectedComponentId = computed(() => this.editorState.selectedComponentId());

  constructor(private editorState: EditorStateService) {}

  onSelectComponent(id: string): void {
    this.editorState.dispatch({
      type: 'SELECT_COMPONENT',
      payload: { id },
    });
  }

  onItemDrop(event: { id: string; newParentId?: string; newIndex: number }): void {
    this.editorState.dispatch({
      type: 'MOVE_COMPONENT',
      payload: event,
    });
  }

  onDuplicateComponent(id: string): void {
    this.editorState.dispatch({
      type: 'DUPLICATE_COMPONENT',
      payload: { id },
    });
  }

  onDeleteComponent(id: string): void {
    this.editorState.dispatch({
      type: 'DELETE_COMPONENT',
      payload: { id },
    });
  }

  collapseAll(): void {
    // Implement collapse all logic
  }
}
