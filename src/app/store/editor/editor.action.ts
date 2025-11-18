import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ComponentInstance } from '../../core/models/component.model';

export const EditorActions = createActionGroup({
  source: 'Editor',
  events: {
    // Component Management
    'Add Component': props<{ component: ComponentInstance; parentId?: string }>(),
    'Update Component': props<{ id: string; props: Record<string, any> }>(),
    'Delete Component': props<{ id: string }>(),
    'Move Component': props<{ id: string; newParentId?: string; newIndex: number }>(),
    'Duplicate Component': props<{ id: string }>(),
    'Select Component': props<{ id: string | null }>(),

    // History Management
    'Undo': emptyProps(),
    'Redo': emptyProps(),

    // Responsive Mode
    'Set Responsive Mode': props<{ mode: 'desktop' | 'tablet' | 'mobile' }>(),

    // Load/Save
    'Load State': props<{ components: ComponentInstance[] }>(),
    'Save State': emptyProps(),
    'Save State Success': emptyProps(),
    'Save State Failure': props<{ error: string }>(),

    // Utility
    'Clear Error': emptyProps(),
    'Mark Clean': emptyProps()
  }
});
