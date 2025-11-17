import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { ComponentInstance } from '../../../core/models/component.model';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag],
  template: `
    <div class="tree-view" 
         cdkDropList
         [cdkDropListData]="items()"
         (cdkDropListDropped)="onDrop($event)">
      @for (item of items(); track item.id) {
        <div class="tree-item-wrapper">
          <div class="tree-item"
               cdkDrag
               [class.selected]="selectedId() === item.id"
               (click)="handleItemClick(item.id, $event)">
            <div class="item-content">
              <button class="expand-button" 
                      *ngIf="item.children.length > 0"
                      (click)="toggleExpand(item.id, $event)">
                <span class="material-icons">
                  {{ isExpanded(item.id) ? 'expand_more' : 'chevron_right' }}
                </span>
              </button>
              <span class="item-icon material-icons">{{ getIcon(item.type) }}</span>
              <span class="item-name">{{ item.type }}</span>
              <div class="item-actions">
                <button (click)="handleDuplicate(item.id, $event)" title="Duplicate">
                  <span class="material-icons">content_copy</span>
                </button>
                <button (click)="handleDelete(item.id, $event)" title="Delete">
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </div>
          </div>

          @if (item.children.length > 0 && isExpanded(item.id)) {
            <div class="tree-children">
              <app-tree-view
                [items]="item.children"
                [selectedId]="selectedId()"
                (itemClick)="itemClick.emit($event)"
                (itemDrop)="itemDrop.emit($event)"
                (itemDuplicate)="itemDuplicate.emit($event)"
                (itemDelete)="itemDelete.emit($event)">
              </app-tree-view>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .tree-view {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .tree-item-wrapper {
      display: flex;
      flex-direction: column;
    }

    .tree-item {
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
      user-select: none;
    }

    .tree-item:hover {
      background: #f5f5f5;
    }

    .tree-item.selected {
      background: #e3f2fd;
      border-left: 3px solid #007bff;
    }

    .item-content {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .expand-button {
      padding: 0;
      width: 20px;
      height: 20px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-icon {
      font-size: 18px;
      color: #007bff;
    }

    .item-name {
      flex: 1;
      font-size: 14px;
    }

    .item-actions {
      display: none;
      gap: 4px;
    }

    .tree-item:hover .item-actions {
      display: flex;
    }

    .item-actions button {
      padding: 4px;
      background: none;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }

    .item-actions button:hover {
      background: #e0e0e0;
    }

    .item-actions .material-icons {
      font-size: 16px;
      color: #666;
    }

    .tree-children {
      margin-left: 24px;
      padding-left: 8px;
      border-left: 1px solid #e0e0e0;
    }

    .material-icons {
      font-size: 18px;
    }

    .cdk-drag-preview {
      padding: 8px;
      background: white;
      border: 1px solid #007bff;
      border-radius: 4px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }

    .cdk-drag-placeholder {
      background: #e3f2fd;
      border: 2px dashed #2196f3;
      min-height: 32px;
    }
  `]
})
export class TreeViewComponent {
  items = input.required<ComponentInstance[]>();
  selectedId = input<string | null>(null);

  itemClick = output<string>();
  itemDrop = output<{ id: string; newParentId?: string; newIndex: number }>();
  itemDuplicate = output<string>();
  itemDelete = output<string>();

  private expandedItems = new Set<string>();

  isExpanded(id: string): boolean {
    return this.expandedItems.has(id);
  }

  toggleExpand(id: string, event: Event): void {
    event.stopPropagation();
    if (this.expandedItems.has(id)) {
      this.expandedItems.delete(id);
    } else {
      this.expandedItems.add(id);
    }
  }

  handleItemClick(id: string, event: Event): void {
    event.stopPropagation();
    this.itemClick.emit(id);
  }

  handleDuplicate(id: string, event: Event): void {
    event.stopPropagation();
    this.itemDuplicate.emit(id);
  }

  handleDelete(id: string, event: Event): void {
    event.stopPropagation();
    this.itemDelete.emit(id);
  }

  onDrop(event: CdkDragDrop<ComponentInstance[]>): void {
    const item = event.item.data as ComponentInstance;
    this.itemDrop.emit({
      id: item.id,
      newIndex: event.currentIndex,
    });
  }

  getIcon(type: string): string {
    const iconMap: Record<string, string> = {
      Container: 'view_quilt',
      Text: 'text_fields',
      Image: 'image',
      Button: 'smart_button',
      Input: 'input',
      Form: 'dynamic_form',
    };
    return iconMap[type] || 'widgets';
  }
}
