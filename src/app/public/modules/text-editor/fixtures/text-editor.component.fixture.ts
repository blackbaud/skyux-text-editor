import {
  Component
} from '@angular/core';

import {
  availableFontList
} from '../types/available-font-list';

import {
  SkyuxRichTextEditorStyleState
} from '../types/style-state';
import {
  SkyuxRichTextEditorToolbarSection
} from '../types/toolbar-section';

import {
  availableFontSizeList
} from '../types/available-font-size-list';

import {
  SkyuxRichTextEditorMenubarSection
} from '../types/menubar-section';

import {
  SkyTextEditorMergeField
} from '../types/text-editor-merge-field';

/**
 * @internal
 */
@Component({
  selector: 'text-editor-test',
  templateUrl: './text-editor.component.fixture.html'
})
export class TextEditorFixtureComponent {
  public value: string = '<p>Some text</p>';
  public placeholder: string;

  public fontSizeList = availableFontSizeList;

  public fontList = availableFontList;

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

  public autofocus = false;

  public mergeFields: SkyTextEditorMergeField[] = [
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

  public styleState: SkyuxRichTextEditorStyleState = {} as SkyuxRichTextEditorStyleState;
}
