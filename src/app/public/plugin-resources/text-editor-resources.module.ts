import {
  NgModule
} from '@angular/core';

import {
  SkyI18nModule,
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyTextEditorResourcesProvider
} from './text-editor-resources-provider';

@NgModule({
  providers: [
    {
      provide: SKY_LIB_RESOURCES_PROVIDERS,
      useClass: SkyTextEditorResourcesProvider,
      multi: true
    }
  ],
  exports: [
    SkyI18nModule
  ]
})
export class SkyTextEditorResourcesModule {}
