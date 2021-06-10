import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';
import { SkyRichTextDisplayComponent } from './rich-text-display.component';
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
    SkyRichTextDisplayComponent
  ],
  providers: [
    SkyRichTextSanitizationService
  ],
  declarations: [
    SkyRichTextDisplayComponent
  ]
})
export class SkyRichTextDisplayModule { }
