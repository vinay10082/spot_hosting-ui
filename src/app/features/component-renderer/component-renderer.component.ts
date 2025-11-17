import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ComponentInstance } from '../../core/models/component.model';

@Component({
  selector: 'app-component-renderer',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag],
  template: `
    <div class="component-wrapper" [ngStyle]="getStyles()">
      @switch (component().type) {
        @case ('Container') {
          <div class="container-component"
               cdkDropList
               [cdkDropListData]="component().children"
               [cdkDropListConnectedTo]="['canvas-root']"
               (cdkDropListDropped)="onDropInside($event)">
            @for (child of component().children; track child.id) {
              <div cdkDrag 
                   [cdkDragData]="child"
                   (click)="selectChild(child.id, $event)">
                <app-component-renderer
                  [component]="child"
                  [isCanvas]="isCanvas()"
                  [selectedId]="selectedId()"
                  (selectComponent)="selectComponent.emit($event)">
                </app-component-renderer>
              </div>
            }
            @if (component().children.length === 0) {
              <div class="empty-container">Drop components here</div>
            }
          </div>
        }
        @case ('Text') {
          <p [ngStyle]="getTextStyles()">{{ component().props['content'] }}</p>
        }
        @case ('Image') {
          <img 
            [src]="component().props['src']"
            [alt]="component().props['alt']"
            [ngStyle]="getImageStyles()">
        }
        @case ('Button') {
          <button [ngStyle]="getButtonStyles()">
            {{ component().props['label'] }}
          </button>
        }
        @case ('Input') {
          <div class="input-wrapper">
            @if (component().props['label']) {
              <label>{{ component().props['label'] }}</label>
            }
            <input 
              [type]="component().props['type']"
              [placeholder]="component().props['placeholder']"
              [required]="component().props['required']">
          </div>
        }
        @case ('Form') {
          <form [ngStyle]="getFormStyles()">
            @for (child of component().children; track child.id) {
              <app-component-renderer
                [component]="child"
                [isCanvas]="isCanvas()"
                [selectedId]="selectedId()"
                (selectComponent)="selectComponent.emit($event)">
              </app-component-renderer>
            }
          </form>
        }
      }
    </div>
  `,
  styles: [`
    .component-wrapper {
      width: 100%;
    }

    .container-component {
      min-height: 60px;
      position: relative;
    }

    .empty-container {
      padding: 32px;
      text-align: center;
      color: #999;
      border: 2px dashed #ddd;
      border-radius: 4px;
    }

    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    label {
      font-size: 14px;
      font-weight: 500;
    }

    input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    img {
      max-width: 100%;
      display: block;
    }
  `]
})
export class ComponentRendererComponent {
  component = input.required<ComponentInstance>();
  isCanvas = input<boolean>(false);
  selectedId = input<string | null>(null);

  selectComponent = output<string>();
  dropInside = output<CdkDragDrop<ComponentInstance[]>>();

  getStyles(): Record<string, string> {
    const props = this.component().props;
    const styles: Record<string, string> = {};

    if (this.component().type === 'Container') {
      styles['display'] = props['display'] || 'flex';
      styles['flex-direction'] = props['flexDirection'] || 'row';
      styles['gap'] = `${props['gap'] || 16}px`;
      styles['padding'] = `${props['padding'] || 16}px`;
      styles['background-color'] = props['backgroundColor'] || '#ffffff';
    }

    return styles;
  }

  getTextStyles(): Record<string, string> {
    const props = this.component().props;
    return {
      'font-size': `${props['fontSize'] || 16}px`,
      'font-weight': props['fontWeight'] || 'normal',
      'color': props['color'] || '#000000',
      'text-align': props['textAlign'] || 'left',
      'margin': '0',
    };
  }

  getImageStyles(): Record<string, string> {
    const props = this.component().props;
    return {
      'width': props['width'] ? `${props['width']}px` : 'auto',
      'height': props['height'] ? `${props['height']}px` : 'auto',
      'object-fit': props['objectFit'] || 'cover',
    };
  }

  getButtonStyles(): Record<string, string> {
    const props = this.component().props;
    return {
      'background-color': props['backgroundColor'] || '#007bff',
      'color': props['textColor'] || '#ffffff',
    };
  }

  getFormStyles(): Record<string, string> {
    const props = this.component().props;
    return {
      'display': 'flex',
      'flex-direction': 'column',
      'gap': `${props['gap'] || 16}px`,
    };
  }

  selectChild(id: string, event: Event): void {
    event.stopPropagation();
    this.selectComponent.emit(id);
  }

  onDropInside(event: CdkDragDrop<ComponentInstance[]>): void {
    this.dropInside.emit(event);
  }
}
