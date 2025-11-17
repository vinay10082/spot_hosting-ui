import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDropList, CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { ComponentInstance } from '../../../../core/models/component.model';
import { ComponentRendererComponent } from '../../../component-renderer/component-renderer.component';

@Component({
  selector: 'app-editor-canvas',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, CdkDragPlaceholder, ComponentRendererComponent],
  template: `
    <div class="canvas-container" 
         [class.desktop]="responsiveMode() === 'desktop'" 
         [class.tablet]="responsiveMode() === 'tablet'"
         [class.mobile]="responsiveMode() === 'mobile'">
      <div class="canvas" 
           cdkDropList
           id="canvas-root"
           [cdkDropListData]="components()"
           [cdkDropListConnectedTo]="sidebarLists"
           (cdkDropListDropped)="onDrop($event)">
        @if (components().length === 0) {
          <div class="empty-state">
            <span class="material-icons" style="font-size: 48px; color: #ccc; margin-bottom: 16px;">widgets</span>
            <p>Drag components here to start building</p>
          </div>
        }
        @for (component of components(); track component.id) {
          <div class="canvas-item"
               cdkDrag
               [cdkDragData]="component"
               (click)="onSelectComponent(component.id)"
               [class.selected]="selectedComponentId() === component.id">
            <div class="drag-placeholder" *cdkDragPlaceholder></div>
            <app-component-renderer
              [component]="component"
              [isCanvas]="true"
              [selectedId]="selectedComponentId()"
              (selectComponent)="onSelectComponent($event)">
            </app-component-renderer>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .canvas-container {
      flex: 1;
      display: flex;
      justify-content: center;
      padding: 24px;
      background: #f5f5f5;
      overflow: auto;
      transition: all 0.3s ease;
    }

    .canvas {
      background: white;
      min-height: 600px;
      width: 100%;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: width 0.3s ease;
    }

    .canvas-container.desktop .canvas {
      max-width: 1200px;
    }

    .canvas-container.tablet .canvas {
      max-width: 768px;
    }

    .canvas-container.mobile .canvas {
      max-width: 375px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 400px;
      color: #999;
      font-size: 18px;
      border: 2px dashed #ddd;
      border-radius: 8px;
    }

    .canvas-item {
      position: relative;
      transition: all 0.2s;
      margin-bottom: 8px;
    }

    .canvas-item.selected {
      outline: 2px solid #007bff;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .canvas-item:hover:not(.selected) {
      outline: 1px dashed #007bff;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .drag-placeholder {
      background: #e3f2fd;
      border: 2px dashed #2196f3;
      min-height: 60px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .cdk-drag-preview {
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      opacity: 0.9;
      border-radius: 4px;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drop-list-dragging .cdk-drag {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    /* Show drop zone highlight when dragging */
    .canvas.cdk-drop-list-dragging {
      background: #f0f8ff;
      border: 2px dashed #2196f3;
    }
  `]
})
export class EditorCanvasComponent {
  components = input.required<ComponentInstance[]>();
  selectedComponentId = input<string | null>(null);
  responsiveMode = input<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Connect to all sidebar drop lists
  sidebarLists = ['sidebar-layout', 'sidebar-content', 'sidebar-form', 'sidebar-media'];

  componentDropped = output<CdkDragDrop<any>>();
  componentSelected = output<string>();

  onDrop(event: CdkDragDrop<any>) {
    console.log('Canvas drop event:', event);
    console.log('Previous container:', event.previousContainer.id);
    console.log('Current container:', event.container.id);
    this.componentDropped.emit(event);
  }

  onSelectComponent(componentId: string) {
    this.componentSelected.emit(componentId);
  }
}
