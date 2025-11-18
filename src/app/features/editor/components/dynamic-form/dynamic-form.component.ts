import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentInstance, ComponentDefinition } from '../../../../core/models/component.model';

@Component({
  standalone: false,
  selector: 'app-dynamic-form',
  template: `<form [formGroup]="propertyForm" *ngIf="propertyForm && definition">
  <div *ngFor="let property of definition.properties" class="form-field">
    <label class="field-label">
      {{ property.name }}
      <span *ngIf="property.validation?.required" class="required">*</span>
    </label>

    <!-- String Input -->
    <input 
      *ngIf="property.type === 'string'"
      type="text"
      [formControlName]="property.name"
      class="field-input"
      [placeholder]="'Enter ' + property.name">

    <!-- Number Input -->
    <input 
      *ngIf="property.type === 'number'"
      type="number"
      [formControlName]="property.name"
      class="field-input"
      [min]="property.validation?.min ?? null"
      [max]="property.validation?.max ?? null">

    <!-- Boolean Checkbox -->
    <label *ngIf="property.type === 'boolean'" class="checkbox-label">
      <input 
        type="checkbox"
        [formControlName]="property.name">
      <span>Enable {{ property.name }}</span>
    </label>

    <!-- Color Picker -->
    <input 
      *ngIf="property.type === 'color'"
      type="color"
      [formControlName]="property.name"
      class="field-input color-input">

    <!-- Select Dropdown -->
    <select 
      *ngIf="property.type === 'select'"
      [formControlName]="property.name"
      class="field-select">
      <option *ngFor="let option of property.options" [value]="option">
        {{ option }}
      </option>
    </select>

    <!-- Spacing Input (for padding, margin) -->
    <input 
      *ngIf="property.type === 'spacing'"
      type="text"
      [formControlName]="property.name"
      class="field-input"
      placeholder="e.g., 10px, 1rem">

    <!-- Typography Input -->
    <input 
      *ngIf="property.type === 'typography'"
      type="text"
      [formControlName]="property.name"
      class="field-input"
      placeholder="e.g., 16px, 1.5rem">
  </div>
</form>`,
  styles: [`.form-field {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
}

.required {
  color: #e74c3c;
  margin-left: 2px;
}

.field-input,
.field-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  transition: border-color 0.2s;
}

.field-input:focus,
.field-select:focus {
  outline: none;
  border-color: #007bff;
}

.color-input {
  height: 40px;
  padding: 4px;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label span {
  font-size: 13px;
  color: #555;
}`]
})
export class DynamicFormComponent implements OnInit {
  @Input() componentInstance!: ComponentInstance;
  @Input() definition!: ComponentDefinition | undefined;
  @Output() propertyChange = new EventEmitter<{ name: string; value: any }>();

  propertyForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    if (!this.definition) return;

    const formControls: any = {};
    this.definition.properties.forEach(prop => {
      formControls[prop.name] = [this.componentInstance.props[prop.name] || prop.defaultValue];
    });

    this.propertyForm = this.fb.group(formControls);

    // Subscribe to value changes
    this.propertyForm.valueChanges.subscribe(values => {
      Object.keys(values).forEach(key => {
        if (values[key] !== this.componentInstance.props[key]) {
          this.propertyChange.emit({ name: key, value: values[key] });
        }
      });
    });
  }
}
