import {
  availableFontList
} from '../types/available-font-list';

import {
  SkyuxRichTextEditorStyleState
} from '../types/style-state';

/**
 * @internal
 */
export const styleStateDefaults: SkyuxRichTextEditorStyleState = {
  backColor: 'rgba(0, 0, 0, 0)',
  fontColor: '#000',
  fontSize: 14,
  font: availableFontList[0].value,
  boldState: false,
  italicState: false,
  underlineState: false,
  linkState: false
};
