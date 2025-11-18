import { Component, Input } from '@angular/core';
import { ComponentInstance } from '../../../../core/models/component.model';

@Component({
  standalone: false,
  selector: 'app-component-renderer',
  template: `<div class="component-wrapper" [ngStyle]="getStyleObject()">
  <div class="component-badge">{{ component.type }}</div>
  
  <div [ngSwitch]="component.type">
    <!-- Container -->
    <div *ngSwitchCase="'container'" class="rendered-container">
      <div *ngFor="let child of component.children">
        <app-component-renderer [component]="child"></app-component-renderer>
      </div>
    </div>

    <!-- Text -->
    <div *ngSwitchCase="'text'" class="rendered-text">
      {{ component.props['content'] || 'Text Component' }}
    </div>

    <!-- Button -->
    <button *ngSwitchCase="'button'" class="rendered-button">
      {{ component.props['label'] || 'Button' }}
    </button>

    <!-- Heading -->
    <h2 *ngSwitchCase="'heading'" class="rendered-heading">
      {{ component.props['content'] || 'Heading' }}
    </h2>

    <!-- Image -->
    <div *ngSwitchCase="'image'" class="rendered-image">
      <img 
        [src]="component.props['src'] || 'https://via.placeholder.com/300x200'" 
        [alt]="component.props['alt'] || 'Image'"
        style="max-width: 100%; height: auto;">
    </div>

    <!-- Input -->
    <input 
      *ngSwitchCase="'input'" 
      type="text"
      class="rendered-input"
      [placeholder]="component.props['placeholder'] || 'Enter text...'"
      [value]="component.props['value'] || ''">

    <!-- Default -->
    <div *ngSwitchDefault class="rendered-default">
      {{ component.type }} Component
    </div>
  </div>
</div>`,
  styles: [`.component-wrapper {
  position: relative;
  min-height: 40px;
}

.component-badge {
  position: absolute;
  top: -8px;
  left: -8px;
  background-color: #007bff;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
}

.component-wrapper:hover .component-badge {
  opacity: 1;
}

.rendered-container {
  border: 1px dashed #ccc;
  padding: 16px;
  min-height: 60px;
}

.rendered-text {
  padding: 8px;
}

.rendered-button {
  padding: 8px 16px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.rendered-heading {
  margin: 0;
  padding: 8px 0;
}

.rendered-image {
  padding: 8px;
}

.rendered-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.rendered-default {
  padding: 16px;
  background-color: #f0f0f0;
  border: 1px dashed #999;
  text-align: center;
  color: #666;
}`]
})
export class ComponentRendererComponent {
  @Input() component!: ComponentInstance;

  getStyleObject(): any {
    const props = this.component.props;
    return {
      'background-color': props['backgroundColor'] || 'transparent',
      'color': props['textColor'] || 'inherit',
      'padding': props['padding'] || '0',
      'margin': props['margin'] || '0',
      'border-radius': props['borderRadius'] || '0',
      'font-size': props['fontSize'] || 'inherit',
      'font-weight': props['fontWeight'] || 'normal',
      'text-align': props['textAlign'] || 'left',
      'width': props['width'] || 'auto',
      'height': props['height'] || 'auto'
    };
  }

  renderComponent(): string {
    switch (this.component.type) {
      case 'container':
        return 'Container';
      case 'text':
        return this.component.props['content'] || 'Text Component';
      case 'button':
        return this.component.props['label'] || 'Button';
      case 'heading':
        return this.component.props['content'] || 'Heading';
      case 'image':
        return '🖼️ Image';
      case 'input':
        return 'Input Field';
      default:
        return this.component.type;
    }
  }
}
