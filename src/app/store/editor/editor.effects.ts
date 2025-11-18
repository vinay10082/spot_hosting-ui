import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, switchMap, debounceTime } from 'rxjs/operators';
import { EditorActions } from './editor.action';

@Injectable()
export class EditorEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  saveState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EditorActions.saveState),
      debounceTime(2000),
      switchMap(() =>
        this.http.post('/api/editor/save', {}).pipe(
          map(() => EditorActions.saveStateSuccess()),
          catchError(error =>
            of(EditorActions.saveStateFailure({
              error: error.message || 'Failed to save'
            }))
          )
        )
      )
    )
  );
}
