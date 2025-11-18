import { ComponentInstance } from '../../core/models/component.model';

export interface HistoryState {
  past: ComponentInstance[][];
  present: ComponentInstance[];
  future: ComponentInstance[][];
}

export interface EditorState {
  components: ComponentInstance[];
  selectedComponentId: string | null;
  history: HistoryState;
  responsiveMode: 'desktop' | 'tablet' | 'mobile';
  isDirty: boolean;
  loading: boolean;
  error: string | null;
}

export const initialEditorState: EditorState = {
  components: [],
  selectedComponentId: null,
  history: {
    past: [],
    present: [],
    future: []
  },
  responsiveMode: 'desktop',
  isDirty: false,
  loading: false,
  error: null
};
