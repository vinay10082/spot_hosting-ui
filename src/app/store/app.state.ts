import { RouterReducerState } from '@ngrx/router-store';
import { AuthState } from './auth/auth.state';
import { EditorState } from './editor/editor.state';

export interface AppState {
  router: RouterReducerState;
  auth: AuthState;
  editor: EditorState;
}
