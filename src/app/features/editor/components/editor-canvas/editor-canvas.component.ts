import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { ComponentInstance } from '../../../../core/models/component.model';
import { ComponentRendererComponent } from '../../../component-renderer/component-renderer.component';

@Component({
  selector: 'app-editor-canvas',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, CdkDragPlaceholder, ComponentRendererComponent],
  template: `
    <div class="canvas-container" [class.desktop]="responsiveMode() === 'desktop'" 
         [class.tablet]="responsiveMode() === 'tablet'"
         [class.mobile]="responsiveMode() === 'mobile'">
      <div class="canvas" 
           cdkDropList
           [cdkDropListData]="components()"
           [cdkDropListConnectedTo]="connectedDropLists()"
           (cdkDropListDropped)="onDrop($event)"
           id="canvas-root">
        @if (components().length === 0) {
          <div class="empty-state">
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
              (selectComponent)="onSelectComponent($event)"
              (dropInside)="onDropInside($event, component)">
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
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: width 0.3s ease;
    }

    .canvas-container.desktop .canvas {
      width: 100%;
      max-width: 1200px;
    }

    .canvas-container.tablet .canvas {
      width: 768px;
    }

    .canvas-container.mobile .canvas {
      width: 375px;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
      font-size: 18px;
    }

    .canvas-item {
      position: relative;
      transition: all 0.2s;
    }

    .canvas-item.selected {
      outline: 2px solid #007bff;
      outline-offset: 2px;
    }

    .canvas-item:hover {
      outline: 1px dashed #007bff;
      outline-offset: 2px;
    }

    .drag-placeholder {
      background: #e3f2fd;
      border: 2px dashed #2196f3;
      min-height: 60px;
      transition: all 0.3s ease;
    }

    .cdk-drag-preview {
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      opacity: 0.8;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class EditorCanvasComponent {
  components = input.required<ComponentInstance[]>();
  selectedComponentId = input<string | null>(null);
  responsiveMode = input<'desktop' | 'tablet' | 'mobile'>('desktop');
  connectedDropLists = input<string[]>([]);

  componentDropped = output<CdkDragDrop<ComponentInstance[]>>();
  componentSelected = output<string>();

  onDrop(event: CdkDragDrop<ComponentInstance[]>) {
    this.componentDropped.emit(event);
  }

  onSelectComponent(componentId: string) {
    this.componentSelected.emit(componentId);
  }

  onDropInside(event: CdkDragDrop<ComponentInstance[]>, parent: ComponentInstance) {
    this.componentDropped.emit(event);
  }
}
