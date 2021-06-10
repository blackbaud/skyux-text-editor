import {
  NgModule
} from '@angular/core';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyPageModule
} from '@skyux/layout';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyRichTextExpandModule
} from './public/modules/rich-text-expand/rich-text-expand.module';

import {
  SkyTooltipModule
} from './public/modules/tooltip/tooltip.module';

import {
  SkyRichTextDisplayModule,
  SkyRichTextEditorModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDocsToolsModule,
    SkyPageModule,
    SkyAppLinkModule,
    SkyRichTextEditorModule,
    SkyRichTextDisplayModule,
    SkyRichTextExpandModule,
    SkyTooltipModule,
    SkyIconModule,
    SkyIdModule,
    SkyInputBoxModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-text-editor',
        packageName: '@skyux/text-editor'
      }
    }
  ]
})
export class AppExtrasModule { }
