import {
  Component
} from '@angular/core';

import {
  availableFontList
} from '../types/available-font-list';

import {
  SkyTextEditorStyleState
} from '../types/style-state';
import {
  SkyTextEditorToolbarSection
} from '../types/toolbar-section';

import {
  availableFontSizeList
} from '../types/available-font-size-list';

import {
  SkyTextEditorMenubarSection
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

  public toolbarSections: SkyTextEditorToolbarSection[] = [
    SkyTextEditorToolbarSection.FontFamily,
    SkyTextEditorToolbarSection.FontSize,
    SkyTextEditorToolbarSection.Color,
    SkyTextEditorToolbarSection.List,
    SkyTextEditorToolbarSection.FontStyle,
    SkyTextEditorToolbarSection.Alignment,
    SkyTextEditorToolbarSection.Indentation,
    SkyTextEditorToolbarSection.UndoRedo,
    SkyTextEditorToolbarSection.Link
  ];

  public menubarSections: SkyTextEditorMenubarSection[] = [
    SkyTextEditorMenubarSection.Edit,
    SkyTextEditorMenubarSection.Format,
    SkyTextEditorMenubarSection.MergeField
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

  public styleState: SkyTextEditorStyleState = {} as SkyTextEditorStyleState;
}
