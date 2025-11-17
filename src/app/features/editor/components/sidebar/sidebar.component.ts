import { Component, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { ComponentRegistryService } from '../../../../core/services/component-registry.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag],
  template: `
    <div class="sidebar">
      <h3>Components</h3>
      @for (category of categories; track category) {
        <div class="category">
          <h4>{{ category | titlecase }}</h4>
          <div class="component-list" 
               cdkDropList
               [id]="'sidebar-' + category"
               [cdkDropListData]="componentsByCategory()[category]"
               [cdkDropListConnectedTo]="['canvas-root']"
               [cdkDropListSortingDisabled]="true"
               (cdkDropListDropped)="onComponentDrop($event)">
            @for (component of componentsByCategory()[category]; track component.id) {
              <div class="component-item"
                   cdkDrag
                   [cdkDragData]="component">
                <span class="material-icons">{{ component.icon }}</span>
                <span>{{ component.name }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid #e0e0e0;
      padding: 16px;
      overflow-y: auto;
    }

    h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .category {
      margin-bottom: 24px;
    }

    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      font-weight: 500;
    }

    .component-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 50px;
    }

    .component-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 4px;
      cursor: grab;
      transition: all 0.2s;
    }

    .component-item:hover {
      background: #e3f2fd;
      transform: translateX(4px);
    }

    .component-item:active {
      cursor: grabbing;
    }

    .material-icons {
      font-size: 20px;
      color: #007bff;
    }

    .cdk-drag-preview {
      padding: 12px;
      background: white;
      border: 2px solid #007bff;
      border-radius: 4px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cdk-drag-placeholder {
      opacity: 0;
    }
  `]
})
export class SidebarComponent {
  componentDropped = output<CdkDragDrop<any>>();

  categories = ['layout', 'content', 'form', 'media'];
  componentsByCategory = computed(() => this.componentRegistry.componentsByCategory());

  constructor(private componentRegistry: ComponentRegistryService) {}

  onComponentDrop(event: CdkDragDrop<any>) {
    // This prevents items from being reordered in sidebar
    // Only emit when dropping to canvas
    if (event.previousContainer !== event.container) {
      this.componentDropped.emit(event);
    }
  }
}
