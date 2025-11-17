import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditorStateService } from '../../../../core/services/editor-state.service';
import { ComponentRegistryService } from '../../../../core/services/component-registry.service';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent],
  template: `
    <div class="properties-panel">
      @if (selectedComponent(); as component) {
        <div class="panel-header">
          <h3>Properties</h3>
          <span class="component-type">{{ component.type }}</span>
        </div>

        <div class="responsive-toggle">
          <button 
            [class.active]="responsiveMode() === 'desktop'"
            (click)="setResponsiveMode('desktop')">
            <span class="material-icons">desktop_windows</span>
          </button>
          <button 
            [class.active]="responsiveMode() === 'tablet'"
            (click)="setResponsiveMode('tablet')">
            <span class="material-icons">tablet</span>
          </button>
          <button 
            [class.active]="responsiveMode() === 'mobile'"
            (click)="setResponsiveMode('mobile')">
            <span class="material-icons">phone_android</span>
          </button>
        </div>

        <!-- FIX: Add null check here -->
        @if (componentDefinition(); as definition) {
          <app-dynamic-form
            [componentDefinition]="definition"
            [initialValues]="component.props"
            (valueChange)="onPropertyChange($event)">
          </app-dynamic-form>
        }
      } @else {
        <div class="empty-state">
          <p>Select a component to edit its properties</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .properties-panel {
      width: 320px;
      background: white;
      border-left: 1px solid #e0e0e0;
      padding: 16px;
      overflow-y: auto;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .component-type {
      font-size: 12px;
      color: #666;
      background: #f5f5f5;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .responsive-toggle {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .responsive-toggle button {
      flex: 1;
      padding: 8px;
      border: none;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .responsive-toggle button:hover {
      background: #e3f2fd;
    }

    .responsive-toggle button.active {
      background: #007bff;
      color: white;
    }

    .material-icons {
      font-size: 20px;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #999;
      text-align: center;
    }
  `]
})
export class PropertiesPanelComponent {
  selectedComponent = computed(() => this.editorState.selectedComponent());
  responsiveMode = computed(() => this.editorState.responsiveMode());
  
  componentDefinition = computed(() => {
    const component = this.selectedComponent();
    return component ? this.componentRegistry.getDefinitionByType(component.type) : null;
  });

  constructor(
    private editorState: EditorStateService,
    private componentRegistry: ComponentRegistryService
  ) {}

  onPropertyChange(props: Record<string, any>): void {
    const component = this.selectedComponent();
    if (component) {
      this.editorState.dispatch({
        type: 'UPDATE_COMPONENT',
        payload: { id: component.id, props },
      });
    }
  }

  setResponsiveMode(mode: 'desktop' | 'tablet' | 'mobile'): void {
    this.editorState.dispatch({
      type: 'SET_RESPONSIVE_MODE',
      payload: { mode },
    });
  }
}
