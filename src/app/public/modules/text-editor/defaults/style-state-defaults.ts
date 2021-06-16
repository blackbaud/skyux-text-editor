import {
  availableFontList
} from '../types/available-font-list';

import {
  SkyTextEditorStyleState
} from '../types/style-state';

/**
 * @internal
 */
export const STYLE_STATE_DEFAULTS: SkyTextEditorStyleState = {
  backColor: 'rgba(0, 0, 0, 0)',
  fontColor: '#000',
  fontSize: 14,
  font: availableFontList[0].value,
  boldState: false,
  italicState: false,
  underlineState: false,
  linkState: false
};
