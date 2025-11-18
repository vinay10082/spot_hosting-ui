import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectAuthError, selectAuthLoading } from '../../../store';
import { AuthActions } from '../../../store/auth/auth.action';

@Component({
  standalone: false,
  selector: 'app-login',
  template: `<div class="auth-container">
  <div class="auth-card">
    <h2 class="auth-title">Login</h2>
    
    <div *ngIf="error$ | async as error" class="error-message">
      {{ error }}
    </div>

    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          id="username"
          type="text" 
          formControlName="username"
          class="form-control"
          [class.error]="username?.invalid && username?.touched">
        <div *ngIf="username?.invalid && username?.touched" class="error-text">
          <span *ngIf="username?.errors?.['required']">Username is required</span>
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password"
          type="password" 
          formControlName="password"
          class="form-control"
          [class.error]="password?.invalid && password?.touched">
        <div *ngIf="password?.invalid && password?.touched" class="error-text">
          <span *ngIf="password?.errors?.['required']">Password is required</span>
          <span *ngIf="password?.errors?.['minlength']">Password must be at least 6 characters</span>
        </div>
      </div>

      <button 
        type="submit" 
        class="btn btn-primary btn-block"
        [disabled]="loading$ | async">
        {{ (loading$ | async) ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <div class="auth-footer">
      <p>Don't have an account? <a routerLink="/auth/register">Register</a></p>
    </div>
  </div>
</div>
`,
  styles: [`
    .auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  background: white;
  border-radius: 8px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.auth-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
}

.form-control.error {
  border-color: #c33;
}

.error-text {
  color: #c33;
  font-size: 12px;
  margin-top: 5px;
}

.btn-block {
  width: 100%;
  margin-top: 10px;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

    `]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(AuthActions.login({ 
        credentials: this.loginForm.value 
      }));
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}
