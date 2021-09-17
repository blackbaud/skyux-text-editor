import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyModalModule } from '@skyux/modals';
import { SkyTabsModule } from '@skyux/tabs';
import {
  SkyE2eThemeSelectorModule
} from '@skyux/e2e-client';

import { SkyRichTextDisplayModule, SkyTextEditorModule } from 'projects/text-editor/src/public-api';
import { VisualComponent } from './visual.component';
import { RichTextEditorVisualComponent } from './text-editor/text-editor-visual.component';
import { RichTextDisplayVisualComponent } from './rich-text-display/rich-text-display-visual.component';

@NgModule({
  declarations: [
    VisualComponent,
    RichTextDisplayVisualComponent,
    RichTextEditorVisualComponent
  ],
  imports: [
    CommonModule,
    SkyE2eThemeSelectorModule,
    SkyRichTextDisplayModule,
    SkyTextEditorModule,
    SkyModalModule,
    SkyTabsModule
  ]
})
export class VisualModule { }
