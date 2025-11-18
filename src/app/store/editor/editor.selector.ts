import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EditorState } from './editor.state';
import { ComponentInstance } from '../../core/models/component.model';

export const selectEditorState = createFeatureSelector<EditorState>('editor');

export const selectComponents = createSelector(
  selectEditorState,
  (state: EditorState) => state.components
);

export const selectSelectedComponentId = createSelector(
  selectEditorState,
  (state: EditorState) => state.selectedComponentId
);

export const selectSelectedComponent = createSelector(
  selectEditorState,
  (state: EditorState) => {
    if (!state.selectedComponentId) return null;
    return findComponent(state.components, state.selectedComponentId);
  }
);

export const selectResponsiveMode = createSelector(
  selectEditorState,
  (state: EditorState) => state.responsiveMode
);

export const selectCanUndo = createSelector(
  selectEditorState,
  (state: EditorState) => state.history.past.length > 0
);

export const selectCanRedo = createSelector(
  selectEditorState,
  (state: EditorState) => state.history.future.length > 0
);

export const selectIsDirty = createSelector(
  selectEditorState,
  (state: EditorState) => state.isDirty
);

export const selectEditorLoading = createSelector(
  selectEditorState,
  (state: EditorState) => state.loading
);

export const selectEditorError = createSelector(
  selectEditorState,
  (state: EditorState) => state.error
);

function findComponent(components: ComponentInstance[], id: string): ComponentInstance | null {
  for (const comp of components) {
    if (comp.id === id) return comp;
    if (comp.children?.length > 0) {
      const found = findComponent(comp.children, id);
      if (found) return found;
    }
  }
  return null;
}
