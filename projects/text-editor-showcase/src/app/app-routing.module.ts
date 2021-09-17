import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualComponent } from './visual/visual.component';
import { RichTextDisplayVisualComponent } from './visual/rich-text-display/rich-text-display-visual.component';
import { RichTextEditorVisualComponent } from './visual/text-editor/text-editor-visual.component';

const routes: Routes = [
  { path: '', component: VisualComponent },
  { path: 'visual/rich-text-display', component: RichTextDisplayVisualComponent },
  { path: 'visual/text-editor', component: RichTextEditorVisualComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
