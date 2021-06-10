import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

import {
  SkyuxRichTextEditorToolbarSection,
  SkyuxRichTextEditorMenubarSection
} from '../../public/public_api';

/**
 * @internal
 */
@Component({
  selector: 'rich-text-editor-visual',
  templateUrl: './rich-text-editor-visual.component.html',
  styleUrls: ['./rich-text-editor-visual.component.scss']
})
export class RichTextEditorVisualComponent {
  public toolbarSections: SkyuxRichTextEditorToolbarSection[] = [
    SkyuxRichTextEditorToolbarSection.FontFamily,
    SkyuxRichTextEditorToolbarSection.FontSize,
    SkyuxRichTextEditorToolbarSection.Color,
    SkyuxRichTextEditorToolbarSection.List,
    SkyuxRichTextEditorToolbarSection.FontStyle,
    SkyuxRichTextEditorToolbarSection.Alignment,
    SkyuxRichTextEditorToolbarSection.Indentation,
    SkyuxRichTextEditorToolbarSection.UndoRedo,
    SkyuxRichTextEditorToolbarSection.Link
  ];

  public menubarSections: SkyuxRichTextEditorMenubarSection[] = [
    SkyuxRichTextEditorMenubarSection.Edit,
    SkyuxRichTextEditorMenubarSection.Format,
    SkyuxRichTextEditorMenubarSection.MergeField
  ];

  public mergeFields = [
    {
      id: '0',
      name: 'Best field'
    },
    {
      id: '1',
      name: 'Second best field'
    },
    {
      id: '2',
      name: 'A field that is really too long for its own good'
    }
  ];
  public displayValue: SafeHtml;

  public placeholder: string = 'Please enter some text';

  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    if (this.value !== value) {
      this._value = value;
      this.displayValue = this.sanitizer.bypassSecurityTrustHtml(value);
      this.changeDetectorRef.detectChanges();
    }
  }

  private _value = '<font style=\"font-size: 16px\" color=\"#a25353\"><b><i><u>Super styled text</u></i></b></font>';

  constructor(
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.displayValue = this.sanitizer.bypassSecurityTrustHtml(this.value);
  }
}
