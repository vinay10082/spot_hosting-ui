import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { EditorComponent } from './features/editor/editor-component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  { path: 'editor',
    canActivate: [authGuard], component: EditorComponent },
  { 
    path: '', 
    redirectTo: '/editor', // Change default redirect to dashboard
    pathMatch: 'full' 
  },
  { path: '**', redirectTo: '/editor' } // Change wildcard to dashboard
];
