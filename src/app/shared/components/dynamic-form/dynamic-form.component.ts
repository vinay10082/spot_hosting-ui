import { Component, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentDefinition } from '../../../core/models/component.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="dynamic-form">
      @for (property of componentDefinition()?.properties; track property.name) {
        <div class="form-field">
          <label [for]="property.name">{{ property.name | titlecase }}</label>
          
          @switch (property.type) {
            @case ('string') {
              <input 
                [id]="property.name"
                [formControlName]="property.name"
                type="text"
                class="form-control">
            }
            @case ('number') {
              <input 
                [id]="property.name"
                [formControlName]="property.name"
                type="number"
                class="form-control">
            }
            @case ('boolean') {
              <input 
                [id]="property.name"
                [formControlName]="property.name"
                type="checkbox"
                class="form-checkbox">
            }
            @case ('color') {
              <input 
                [id]="property.name"
                [formControlName]="property.name"
                type="color"
                class="form-color">
            }
            @case ('select') {
              <select 
                [id]="property.name"
                [formControlName]="property.name"
                class="form-select">
                @for (option of property.options; track option) {
                  <option [value]="option">{{ option }}</option>
                }
              </select>
            }
            @case ('spacing') {
              <div class="spacing-control">
                <input 
                  [id]="property.name"
                  [formControlName]="property.name"
                  type="range"
                  min="0"
                  max="100"
                  class="form-range">
                <span class="spacing-value">{{ form.get(property.name)?.value }}px</span>
              </div>
            }
            @case ('typography') {
              <div class="typography-control">
                <input 
                  [id]="property.name"
                  [formControlName]="property.name"
                  type="number"
                  min="8"
                  max="72"
                  class="form-control">
                <span>px</span>
              </div>
            }
          }
          
          @if (form.get(property.name)?.errors && form.get(property.name)?.touched) {
            <div class="error-message">
              @if (form.get(property.name)?.errors?.['required']) {
                This field is required
              }
            </div>
          }
        </div>
      }
    </form>
  `,
  styles: [`
    .dynamic-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    label {
      font-size: 13px;
      font-weight: 500;
      color: #333;
    }

    .form-control, .form-select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus, .form-select:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .form-color {
      width: 100%;
      height: 40px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .spacing-control, .typography-control {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-range {
      flex: 1;
    }

    .spacing-value {
      min-width: 50px;
      text-align: right;
      font-size: 13px;
      color: #666;
    }

    .error-message {
      font-size: 12px;
      color: #dc3545;
    }
  `]
})
export class DynamicFormComponent implements OnInit {
  componentDefinition = input.required<ComponentDefinition | null>();
  initialValues = input<Record<string, any>>({});
  valueChange = output<Record<string, any>>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    effect(() => {
      const def = this.componentDefinition();
      const initial = this.initialValues();
      
      if (def) {
        this.buildForm(def, initial);
      }
    });
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(values => {
        this.valueChange.emit(values);
      });
  }

  private buildForm(definition: ComponentDefinition, initialValues: Record<string, any>): void {
    const group: Record<string, any> = {};

    definition.properties.forEach(prop => {
      const validators = [];
      if (prop.validation?.required) {
        validators.push(Validators.required);
      }
      if (prop.validation?.min !== undefined) {
        validators.push(Validators.min(prop.validation.min));
      }
      if (prop.validation?.max !== undefined) {
        validators.push(Validators.max(prop.validation.max));
      }

      group[prop.name] = [initialValues[prop.name] || prop.defaultValue, validators];
    });

    this.form = this.fb.group(group);
  }
}
