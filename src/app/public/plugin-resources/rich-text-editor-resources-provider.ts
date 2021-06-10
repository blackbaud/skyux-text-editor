import {
  SkyAppLocaleInfo,
  SkyLibResourcesProvider
} from '@skyux/i18n';

export class SkyRichTextEditorResourcesProvider implements SkyLibResourcesProvider {

  public getString(localeInfo: SkyAppLocaleInfo, name: string) {
    return name;
  }

}
