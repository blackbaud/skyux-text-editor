import {
  SkyAppLocaleInfo,
  SkyLibResourcesProvider
} from '@skyux/i18n';

export class SkyTextEditorResourcesProvider implements SkyLibResourcesProvider {

  public getString(localeInfo: SkyAppLocaleInfo, name: string) {
    return name;
  }

}
