import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSelectedComponent } from '../../../../store/editor/editor.selector';
import { EditorActions } from '../../../../store/editor/editor.action';
import { ComponentRegistryService } from '../../../../core/services/component-registry.service';

@Component({
  standalone: false,
  selector: 'app-properties-panel',
  template: `<div class="properties-panel">
  <h3 class="panel-title">Properties</h3>

  <ng-container *ngIf="selectedComponent$ | async as component; else noSelection">
    <div class="component-header">
      <div class="component-info">
        <strong>{{ getComponentDefinition(component.type)?.name || component.type }}</strong>
        <span class="component-id">{{ component.id }}</span>
      </div>
      <div class="component-actions">
        <button 
          class="btn-icon-small"
          (click)="onDuplicateComponent(component.id)"
          title="Duplicate">
          📋
        </button>
        <button 
          class="btn-icon-small btn-danger"
          (click)="onDeleteComponent(component.id)"
          title="Delete">
          🗑️
        </button>
      </div>
    </div>

    <div class="property-form">
      <app-dynamic-form
        [componentInstance]="component"
        [definition]="getComponentDefinition(component.type)"
        (propertyChange)="onPropertyChange(component.id, $event.name, $event.value)">
      </app-dynamic-form>
    </div>
  </ng-container>

  <ng-template #noSelection>
    <div class="empty-state">
      <p>👆 Select a component to edit its properties</p>
    </div>
  </ng-template>
</div>`,
  styles: [`.properties-panel {
  padding: 16px;
  flex: 1;
  border-top: 1px solid #e0e0e0;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  background-color: #f8f8f8;
  border-radius: 6px;
  margin-bottom: 16px;
}

.component-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.component-info strong {
  font-size: 14px;
  color: #333;
}

.component-id {
  font-size: 11px;
  color: #999;
  font-family: monospace;
}

.component-actions {
  display: flex;
  gap: 4px;
}

.btn-icon-small {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.btn-icon-small:hover {
  background-color: #e0e0e0;
}

.btn-icon-small.btn-danger:hover {
  background-color: #ffe0e0;
}

.property-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  text-align: center;
  color: #999;
}

.empty-state p {
  font-size: 14px;
}`]
})
export class PropertiesPanelComponent implements OnInit {
  selectedComponent$ = this.store.select(selectSelectedComponent);

  constructor(
    private store: Store,
    private componentRegistry: ComponentRegistryService
  ) {}

  ngOnInit(): void {}

  onPropertyChange(componentId: string, propName: string, value: any): void {
    this.store.dispatch(EditorActions.updateComponent({
      id: componentId,
      props: { [propName]: value }
    }));
  }

  onDeleteComponent(componentId: string): void {
    this.store.dispatch(EditorActions.deleteComponent({ id: componentId }));
  }

  onDuplicateComponent(componentId: string): void {
    this.store.dispatch(EditorActions.duplicateComponent({ id: componentId }));
  }

  getComponentDefinition(type: string) {
    return this.componentRegistry.getDefinitionByType(type);
  }
}
