import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyRichTextEditorResourcesProvider
} from './rich-text-editor-resources-provider';

@NgModule({
  providers: [
    {
      provide: SKY_LIB_RESOURCES_PROVIDERS,
      useClass: SkyRichTextEditorResourcesProvider,
      multi: true
    }
  ]
})
export class SkyRichTextEditorResourcesModule {}
