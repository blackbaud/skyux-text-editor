import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';
import { SkyRichTextExpandComponent } from './rich-text-expand.component';
import { SkyRichTextExpandModalComponent } from './rich-text-expand-modal/rich-text-expand-modal.component';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyModalModule } from '@skyux/modals';
import { SkyRichTextSanitizationService } from '../rich-text-editor/services/rich-text-sanitization.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyI18nModule,
    SkyIdModule,
    SkyModalModule
  ],
  exports: [
    SkyRichTextExpandComponent,
    SkyRichTextExpandModalComponent
  ],
  providers: [
    SkyRichTextSanitizationService
  ],
  declarations: [
    SkyRichTextExpandComponent,
    SkyRichTextExpandModalComponent
  ],
  entryComponents: [
    SkyRichTextExpandModalComponent
  ]
})
export class SkyRichTextExpandModule { }
