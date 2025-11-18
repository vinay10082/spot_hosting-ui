import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../../core/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Login
    'Login': props<{ credentials: LoginRequest }>(),
    'Login Success': props<{ response: AuthResponse }>(),
    'Login Failure': props<{ error: string }>(),

    // Register
    'Register': props<{ data: RegisterRequest }>(),
    'Register Success': props<{ response: AuthResponse }>(),
    'Register Failure': props<{ error: string }>(),

    // Logout
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),

    // Check Auth
    'Check Auth': emptyProps(),
    'Set Authenticated': props<{ user: User; token: string }>(),

    // Clear Error
    'Clear Error': emptyProps()
  }
});
