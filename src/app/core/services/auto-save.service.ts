import { Injectable, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EditorStateService } from './editor-state.service';
import { Subject, debounceTime, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {
  private saveSubject = new Subject<void>();
  private readonly DEBOUNCE_TIME = 2000; // 2 seconds

  constructor(
    private http: HttpClient,
    private editorState: EditorStateService
  ) {
    this.setupAutoSave();
  }

  private setupAutoSave(): void {
    // Watch for state changes
    effect(() => {
      const isDirty = this.editorState.isDirty();
      if (isDirty) {
        this.saveSubject.next();
      }
    });

    // Setup debounced save
    this.saveSubject
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        switchMap(() => this.saveToServer())
      )
      .subscribe({
        next: () => console.log('Auto-saved successfully'),
        error: (err) => console.error('Auto-save failed:', err),
      });
  }

  private saveToServer() {
    const components = this.editorState.components();
    const payload = {
      components,
      timestamp: new Date().toISOString(),
    };

    return this.http.post('/api/editor/save', payload);
  }

  manualSave(): void {
    this.saveToServer().subscribe({
      next: () => console.log('Manual save successful'),
      error: (err) => console.error('Manual save failed:', err),
    });
  }
}
