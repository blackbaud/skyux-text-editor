import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyTextEditorToolbarSection,
  SkyTextEditorMenubarSection
} from '../../public/public_api';

@Component({
  selector: 'text-editor-visual',
  templateUrl: './text-editor-visual.component.html',
  styleUrls: ['./text-editor-visual.component.scss']
})
export class RichTextEditorVisualComponent {

  public displayValue: SafeHtml;

  public menubarSections: SkyTextEditorMenubarSection[] = [
    SkyTextEditorMenubarSection.Edit,
    SkyTextEditorMenubarSection.Format,
    SkyTextEditorMenubarSection.MergeField
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

  public placeholder: string = 'Please enter some text';

  public toolbarSections: SkyTextEditorToolbarSection[] = [
    SkyTextEditorToolbarSection.FontFamily,
    SkyTextEditorToolbarSection.FontSize,
    SkyTextEditorToolbarSection.FontStyle,
    SkyTextEditorToolbarSection.Color,
    SkyTextEditorToolbarSection.List,
    SkyTextEditorToolbarSection.Alignment,
    SkyTextEditorToolbarSection.Indentation,
    SkyTextEditorToolbarSection.UndoRedo,
    SkyTextEditorToolbarSection.Link
  ];

  public set value(value: string) {
    if (this.value !== value) {
      this._value = value;
      this.displayValue = this.sanitizer.bypassSecurityTrustHtml(value);
      this.changeDetectorRef.detectChanges();
    }
  }

  public get value(): string {
    return this._value;
  }

  private _value = '<font style=\"font-size: 16px\" color=\"#a25353\"><b><i><u>Super styled text</u></i></b></font>';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private themeSvc: SkyThemeService
  ) {
    this.displayValue = this.sanitizer.bypassSecurityTrustHtml(this.value);
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
