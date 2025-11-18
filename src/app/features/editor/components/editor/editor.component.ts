import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectCanRedo, selectCanUndo, selectComponents, selectResponsiveMode, selectSelectedComponentId } from '../../../../store/editor/editor.selector';
import { EditorActions } from '../../../../store/editor/editor.action';
import { AuthActions } from '../../../../store/auth/auth.action';


@Component({
  standalone: false,
  selector: 'app-editor',
  template: `<div class="editor-container">
  <!-- Toolbar -->
  <div class="editor-toolbar">
    <div class="toolbar-left">
      <button 
        class="btn btn-icon" 
        [disabled]="!(canUndo$ | async)"
        (click)="onUndo()"
        title="Undo (Ctrl+Z)">
        ↶
      </button>
      <button 
        class="btn btn-icon" 
        [disabled]="!(canRedo$ | async)"
        (click)="onRedo()"
        title="Redo (Ctrl+Y)">
        ↷
      </button>
    </div>

    <div class="toolbar-center">
      <div class="responsive-switcher">
        <button 
          class="btn btn-icon"
          [class.active]="(responsiveMode$ | async) === 'desktop'"
          (click)="onResponsiveModeChange('desktop')"
          title="Desktop View">
          🖥️
        </button>
        <button 
          class="btn btn-icon"
          [class.active]="(responsiveMode$ | async) === 'tablet'"
          (click)="onResponsiveModeChange('tablet')"
          title="Tablet View">
          📱
        </button>
        <button 
          class="btn btn-icon"
          [class.active]="(responsiveMode$ | async) === 'mobile'"
          (click)="onResponsiveModeChange('mobile')"
          title="Mobile View">
          📱
        </button>
      </div>
    </div>

    <div class="toolbar-right">
      <button class="btn btn-primary" (click)="onSave()">
        💾 Save
      </button>
      <button class="btn btn-secondary" (click)="onLogout()">
        Logout
      </button>
    </div>
  </div>

  <!-- Main Editor Layout -->
  <div class="editor-layout">
    <!-- Sidebar -->
    <app-sidebar class="editor-sidebar"></app-sidebar>

    <!-- Canvas -->
    <app-editor-canvas class="editor-canvas"></app-editor-canvas>

    <!-- Right Panel -->
    <div class="editor-right-panel">
      <app-layers-panel></app-layers-panel>
      <app-properties-panel></app-properties-panel>
    </div>
  </div>
</div>`,
  styles: [`.editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.toolbar-left,
.toolbar-center,
.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.responsive-switcher {
  display: flex;
  gap: 4px;
  background-color: #f5f5f5;
  padding: 4px;
  border-radius: 6px;
}

.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 20px;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.btn-icon:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-icon.active {
  background-color: #007bff;
  color: white;
}

.editor-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-sidebar {
  width: 280px;
  background-color: white;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.editor-canvas {
  flex: 1;
  overflow: auto;
  background-color: #f9f9f9;
}

.editor-right-panel {
  width: 320px;
  background-color: white;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}`]
})
export class EditorComponent implements OnInit, OnDestroy {
  components$ = this.store.select(selectComponents);
  selectedComponentId$ = this.store.select(selectSelectedComponentId);
  canUndo$ = this.store.select(selectCanUndo);
  canRedo$ = this.store.select(selectCanRedo);
  responsiveMode$ = this.store.select(selectResponsiveMode);

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Initialize editor state if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onUndo(): void {
    this.store.dispatch(EditorActions.undo());
  }

  onRedo(): void {
    this.store.dispatch(EditorActions.redo());
  }

  onSave(): void {
    this.store.dispatch(EditorActions.saveState());
  }

  onResponsiveModeChange(mode: 'desktop' | 'tablet' | 'mobile'): void {
    this.store.dispatch(EditorActions.setResponsiveMode({ mode }));
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
