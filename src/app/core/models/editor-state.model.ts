import { ComponentInstance } from './component.model';

export interface EditorState {
  components: ComponentInstance[];
  selectedComponentId: string | null;
  history: HistoryState;
  responsiveMode: 'desktop' | 'tablet' | 'mobile';
  isDirty: boolean;
}

export interface HistoryState {
  past: ComponentInstance[][];
  present: ComponentInstance[];
  future: ComponentInstance[][];
}

export type EditorAction =
  | { type: 'ADD_COMPONENT'; payload: { component: ComponentInstance; parentId?: string } }
  | { type: 'UPDATE_COMPONENT'; payload: { id: string; props: Record<string, any> } }
  | { type: 'DELETE_COMPONENT'; payload: { id: string } }
  | { type: 'MOVE_COMPONENT'; payload: { id: string; newParentId?: string; newIndex: number } }
  | { type: 'SELECT_COMPONENT'; payload: { id: string | null } }
  | { type: 'DUPLICATE_COMPONENT'; payload: { id: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_RESPONSIVE_MODE'; payload: { mode: 'desktop' | 'tablet' | 'mobile' } }
  | { type: 'LOAD_STATE'; payload: { components: ComponentInstance[] } };
