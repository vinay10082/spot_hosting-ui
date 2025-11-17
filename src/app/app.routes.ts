import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { EditorComponent } from './features/editor/editor-component';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard], // Add guest guard here
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  { path: 'editor', component: EditorComponent },
  { 
    path: '', 
    redirectTo: '/editor', // Change default redirect to dashboard
    pathMatch: 'full' 
  },
  { path: '**', redirectTo: '/editor' } // Change wildcard to dashboard
];
