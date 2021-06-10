import { availableFontList } from '../types/available-font-list';
import { SkyuxRichTextEditorStyleState } from '../types/style-state';
import {
  SkyuxRichTextEditorToolbarSection
} from '../types/toolbar-section';

import {
  Component
} from '@angular/core';

import {
  availableFontSizeList
} from '../types/available-font-size-list';

import {
  SkyuxRichTextEditorMenubarSection
} from '../types/menubar-section';

import {
  SkyRichTextEditorMergeField
} from '../types/rich-text-editor-merge-field';

/**
 * @internal
 */
@Component({
  selector: 'rich-text-editor-test',
  templateUrl: './rich-text-editor.component.fixture.html'
})
export class RichTextEditorFixtureComponent {
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

  public mergeFields: SkyRichTextEditorMergeField[] = [
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
