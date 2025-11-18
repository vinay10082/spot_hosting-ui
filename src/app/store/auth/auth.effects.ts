import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from './auth.action';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(response => {
            this.authService.saveAuthToken(response.token);
            return AuthActions.loginSuccess({ response });
          }),
          catchError(error => 
            of(AuthActions.loginFailure({ 
              error: error.error?.message || 'Login failed. Please try again.' 
            }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.router.navigate(['/editor']))
    ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ data }) =>
        this.authService.register(data).pipe(
          map(response => {
            this.authService.saveAuthToken(response.token);
            return AuthActions.registerSuccess({ response });
          }),
          catchError(error => 
            of(AuthActions.registerFailure({ 
              error: error.error?.message || 'Registration failed. Please try again.' 
            }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(() => this.router.navigate(['/editor']))
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      map(() => {
        const token = this.authService.getAuthToken();
        if (token) {
          return AuthActions.setAuthenticated({ 
            user: { id: '', username: '', email: '' },
            token 
          });
        }
        return AuthActions.logoutSuccess();
      })
    )
  );
}
