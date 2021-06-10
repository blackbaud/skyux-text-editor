import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyCheckboxModule,
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyColorpickerModule
} from '@skyux/colorpicker';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyTabsModule
} from '@skyux/tabs';

import {
  SkyRichTextEditorResourcesModule
} from '../../plugin-resources/rich-text-editor-resources.module';

import {
  SkyRichTextEditorComponent
} from './rich-text-editor.component';

import {
  SkyRichTextEditorUrlModalComponent
} from './url-modal/url-modal.component';

import {
  SkyIconButtonModule
} from '../icon-btn/icon-button.module';

import {
  SkyRichTextSelectionManagementService
} from './services/rich-text-selection-management.service';

import {
  SkyRichTextToolbarComponent
} from './toolbar/rich-text-toolbar.component';

import {
  SkyRichTextEditorManagementService
} from './services/rich-text-editor-management.service';

import {
  SkyRichTextMergeFieldService
} from './services/rich-text-merge-field.service';

import {
  SkyRichTextMenubarComponent
} from './menu-bar/rich-text-menubar.component';

import {
  SkyTooltipModule
} from '../tooltip/tooltip.module';
import { SkyRichTextSanitizationService } from './services/rich-text-sanitization.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyRichTextEditorResourcesModule,
    SkyI18nModule,
    SkyIconModule,
    SkyIconButtonModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyColorpickerModule,
    SkyCheckboxModule,
    SkyDropdownModule,
    SkyModalModule,
    SkyTooltipModule,
    SkyTabsModule
  ],
  exports: [
    SkyRichTextEditorComponent,
    SkyRichTextEditorUrlModalComponent,
    SkyRichTextToolbarComponent,
    SkyRichTextMenubarComponent
  ],
  declarations: [
    SkyRichTextEditorComponent,
    SkyRichTextEditorUrlModalComponent,
    SkyRichTextToolbarComponent,
    SkyRichTextMenubarComponent
  ],
  providers: [
    SkyRichTextSelectionManagementService,
    SkyRichTextEditorManagementService,
    SkyRichTextMergeFieldService,
    SkyRichTextSanitizationService
  ],
  entryComponents: [
    SkyRichTextEditorUrlModalComponent
  ]
})
export class SkyRichTextEditorModule { }
