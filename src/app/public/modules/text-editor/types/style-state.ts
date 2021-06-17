export interface SkyTextEditorStyleState {

  /**
   * Specifies the background color. Accepts any css color value.
   */
  backColor: string;

  /**
   * Specifies the font color. Accepts any css color value.
   */
  fontColor: string;

  /**
   * Specifies the font size in pixels.
   */
  fontSize: number;

  /**
   * Specifies the font family. Available values: "Blackbaud Sans", "Helvetica Neue",
   * Arial, sans-serif, Arial, Arial Black, Courier New, Times New Roman.
   */
  font: string;

  /**
   * Specifies if bold text is selected.
   */
  boldState: boolean;

  /**
   * Specifies if italicized text is selected.
   */
  italicState: boolean;

  /**
   * Specifies if underlined text is selected.
   */
  underlineState: boolean;

  /**
   * Specifies if link text is selected.
   */
  linkState: boolean;
}
