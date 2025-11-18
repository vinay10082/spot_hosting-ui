import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentRegistryService } from '../../../../core/services/component-registry.service';
import { EditorActions } from '../../../../store/editor/editor.action';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  template: `<div class="sidebar">
  <h3 class="sidebar-title">Components</h3>

  <div class="component-categories">
    <div 
      *ngFor="let category of componentsByCategory | keyvalue"
      class="category">
      <h4 class="category-title">{{ category.key | titlecase }}</h4>
      <div class="component-list">
        <div 
          *ngFor="let component of category.value"
          class="component-item"
          (click)="onAddComponent(component.type)"
          title="Click to add {{ component.name }}">
          <span class="component-icon">{{ component.icon }}</span>
          <span class="component-name">{{ component.name }}</span>
        </div>
      </div>
    </div>
  </div>
</div>`,
  styles: [`.sidebar {
  padding: 16px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.component-categories {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.category:last-child {
  border-bottom: none;
}

.category-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.component-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background-color: #f8f8f8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.component-item:hover {
  background-color: #e8f4ff;
  border-color: #007bff;
  transform: translateY(-2px);
}

.component-icon {
  font-size: 24px;
  margin-bottom: 6px;
}

.component-name {
  font-size: 12px;
  font-weight: 500;
  color: #555;
  text-align: center;
}`]
})
export class SidebarComponent implements OnInit {
  componentsByCategory: Record<string, any[]> = {};

  constructor(
    private componentRegistry: ComponentRegistryService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.componentsByCategory = this.componentRegistry.componentsByCategory;
  }

  onAddComponent(type: string): void {
    const instance = this.componentRegistry.createInstance(type);
    if (instance) {
      this.store.dispatch(EditorActions.addComponent({ component: instance }));
    }
  }
}
