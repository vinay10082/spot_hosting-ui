import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ComponentInstance } from '../../../../core/models/component.model';

@Component({
  standalone: false,
  selector: 'app-tree-view',
  template: `<div class="tree-view">
  <div 
    *ngFor="let component of components"
    class="tree-node">
    <div 
      class="node-content"
      [class.selected]="component.id === selectedId"
      [style.padding-left.px]="level * 16"
      (click)="onSelect(component.id, $event)">
      
      <span 
        *ngIf="component.children?.length ?? 0 > 0"
        class="expand-icon"
        (click)="toggleExpand(component.id); $event.stopPropagation()">
        {{ isExpanded(component.id) ? '▼' : '▶' }}
      </span>
      
      <span class="node-label">
        {{ component.type }} ({{ component.id.substring(0, 8) }}...)
      </span>

      <div class="node-actions">
        <button 
          class="action-btn"
          (click)="onDuplicate(component.id, $event)"
          title="Duplicate">
          📋
        </button>
        <button 
          class="action-btn danger"
          (click)="onDelete(component.id, $event)"
          title="Delete">
          🗑️
        </button>
      </div>
    </div>

    <div *ngIf="isExpanded(component.id) && (component.children?.length ?? 0) > 0">
      <app-tree-view
        [components]="component.children"
        [selectedId]="selectedId"
        [level]="level + 1"
        (selectComponent)="selectComponent.emit($event)"
        (deleteComponent)="deleteComponent.emit($event)"
        (duplicateComponent)="duplicateComponent.emit($event)">
      </app-tree-view>
    </div>
  </div>
</div>`,
  styles: [`.tree-view {
  font-size: 13px;
}

.tree-node {
  margin-bottom: 2px;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.node-content:hover {
  background-color: #f0f0f0;
}

.node-content.selected {
  background-color: #e6f2ff;
  border-left: 3px solid #007bff;
}

.expand-icon {
  width: 16px;
  display: inline-block;
  margin-right: 4px;
  cursor: pointer;
  user-select: none;
  font-size: 10px;
}

.node-label {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.node-actions {
  display: none;
  gap: 4px;
}

.node-content:hover .node-actions {
  display: flex;
}

.action-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #e0e0e0;
}

.action-btn.danger:hover {
  background-color: #ffe0e0;
}`]
})
export class TreeViewComponent {
  @Input() components: ComponentInstance[] = [];
  @Input() selectedId: string | null = null;
  @Input() level: number = 0;
  @Output() selectComponent = new EventEmitter<string>();
  @Output() deleteComponent = new EventEmitter<string>();
  @Output() duplicateComponent = new EventEmitter<string>();

  expandedNodes: Set<string> = new Set();

  toggleExpand(id: string): void {
    if (this.expandedNodes.has(id)) {
      this.expandedNodes.delete(id);
    } else {
      this.expandedNodes.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedNodes.has(id);
  }

  onSelect(id: string, event: Event): void {
    event.stopPropagation();
    this.selectComponent.emit(id);
  }

  onDelete(id: string, event: Event): void {
    event.stopPropagation();
    this.deleteComponent.emit(id);
  }

  onDuplicate(id: string, event: Event): void {
    event.stopPropagation();
    this.duplicateComponent.emit(id);
  }
}
