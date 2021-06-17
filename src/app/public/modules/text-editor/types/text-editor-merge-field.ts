export interface SkyTextEditorMergeField {

  /**
   * The identifier of this merge field.
   */
  id: string;

  /**
   * The display text of this merge field. Values over 18 characters will be truncated to 15.
   */
  name: string;

  /**
   * The src for a preview image to represent this field in the editor. If not provided,
   * default will be the `name` value in a blue rectangle (truncated if > 18 characters).
   */
  previewImageUrl?: string;

}
