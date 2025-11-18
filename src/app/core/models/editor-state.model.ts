import { ComponentInstance } from './component.model';

export interface HistoryState {
  past: ComponentInstance[][];
  present: ComponentInstance[];
  future: ComponentInstance[][];
}

export interface EditorAction {
  type: string;
  timestamp: number;
  description: string;
}
