import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectComponents, selectSelectedComponentId } from '../../../../store/editor/editor.selector';
import { EditorActions } from '../../../../store/editor/editor.action';

@Component({
  standalone: false,
  selector: 'app-layers-panel',
  template: `<div class="layers-panel">
  <h3 class="panel-title">Layers</h3>

  <div class="layers-list">
    <app-tree-view
      [components]="(components$ | async) || []"
      [selectedId]="selectedComponentId$ | async"
      (selectComponent)="onSelectComponent($event)"
      (deleteComponent)="onDeleteComponent($event)"
      (duplicateComponent)="onDuplicateComponent($event)">
    </app-tree-view>
  </div>

  <div *ngIf="(components$ | async)?.length === 0" class="empty-layers">
    <p>No components yet</p>
  </div>
</div>`,
  styles: [`.layers-panel {
  padding: 16px;
  flex: 0 0 auto;
  max-height: 300px;
  overflow-y: auto;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.layers-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.empty-layers {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #999;
  font-size: 14px;
}`]
})
export class LayersPanelComponent {
  components$ = this.store.select(selectComponents);
  selectedComponentId$ = this.store.select(selectSelectedComponentId);

  constructor(private store: Store) {}

  onSelectComponent(id: string): void {
    this.store.dispatch(EditorActions.selectComponent({ id }));
  }

  onDeleteComponent(id: string): void {
    this.store.dispatch(EditorActions.deleteComponent({ id }));
  }

  onDuplicateComponent(id: string): void {
    this.store.dispatch(EditorActions.duplicateComponent({ id }));
  }
}
