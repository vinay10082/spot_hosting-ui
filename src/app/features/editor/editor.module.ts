import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './components/editor/editor.component';
import { EditorCanvasComponent } from './components/editor-canvas/editor-canvas.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';
import { LayersPanelComponent } from './components/layers-panel/layers-panel.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { ComponentRendererComponent } from './components/component-renderer/component-renderer.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';

import { editorReducer } from '../../store/editor/editor.reducer';
import { EditorEffects } from '../../store/editor/editor.effects';

@NgModule({
  declarations: [
    EditorComponent,
    EditorCanvasComponent,
    SidebarComponent,
    PropertiesPanelComponent,
    LayersPanelComponent,
    TreeViewComponent,
    ComponentRendererComponent,
    DynamicFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    EditorRoutingModule,
    StoreModule.forFeature('editor', editorReducer),
    EffectsModule.forFeature([EditorEffects])
  ]
})
export class EditorModule { }
