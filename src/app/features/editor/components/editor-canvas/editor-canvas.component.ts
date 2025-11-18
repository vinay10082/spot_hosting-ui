import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { selectComponents, selectSelectedComponentId, selectResponsiveMode } from '../../../../store/editor/editor.selector';
import { EditorActions } from '../../../../store/editor/editor.action';

@Component({
  standalone: false,
  selector: 'app-editor-canvas',
  template: `<div class="canvas-wrapper">
  <div 
    class="canvas" 
    [ngClass]="getCanvasClass((responsiveMode$ | async) || 'desktop')">
    
    <div 
      *ngIf="(components$ | async)?.length === 0"
      class="empty-canvas">
      <div class="empty-message">
        <h3>🎨 Start Building</h3>
        <p>Drag and drop components from the sidebar to get started</p>
      </div>
    </div>

    <div 
      cdkDropList
      class="component-list"
      (cdkDropListDropped)="onDropComponent($event)">
      <div
        *ngFor="let component of components$ | async"
        cdkDrag
        [cdkDragData]="component.id"
        class="canvas-component"
        [class.selected]="component.id === (selectedComponentId$ | async)"
        (click)="onSelectComponent(component.id)">
        <app-component-renderer [component]="component"></app-component-renderer>
      </div>
    </div>
  </div>
</div>`,
  styles: [`.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  min-height: 100%;
}

.canvas {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-height: 600px;
  transition: all 0.3s;
  position: relative;
}

.canvas-desktop {
  width: 100%;
  max-width: 1200px;
}

.canvas-tablet {
  width: 768px;
}

.canvas-mobile {
  width: 375px;
}

.empty-canvas {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 600px;
}

.empty-message {
  text-align: center;
  color: #999;
}

.empty-message h3 {
  font-size: 24px;
  margin-bottom: 8px;
}

.empty-message p {
  font-size: 14px;
}

.component-list {
  min-height: 400px;
  padding: 20px;
}

.canvas-component {
  margin-bottom: 16px;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.canvas-component:hover {
  border-color: #b3d9ff;
  background-color: #f0f8ff;
}

.canvas-component.selected {
  border-color: #007bff;
  background-color: #e6f2ff;
}

.cdk-drag-preview {
  opacity: 0.8;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.cdk-drag-placeholder {
  opacity: 0.3;
}

.cdk-drag-animating {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}`]
})
export class EditorCanvasComponent implements OnInit {
  components$ = this.store.select(selectComponents);
  selectedComponentId$ = this.store.select(selectSelectedComponentId);
  responsiveMode$ = this.store.select(selectResponsiveMode);

  constructor(private store: Store) {}

  ngOnInit(): void {}

  onSelectComponent(id: string): void {
    this.store.dispatch(EditorActions.selectComponent({ id }));
  }

  onDropComponent(event: CdkDragDrop<any[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      const componentId = event.item.data;
      this.store.dispatch(EditorActions.moveComponent({
        id: componentId,
        newIndex: event.currentIndex
      }));
    }
  }

  getCanvasClass(mode: string): string {
    return `canvas-${mode}`;
  }
}
