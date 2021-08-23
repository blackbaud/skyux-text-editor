import {
  Component
} from '@angular/core';

import {
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  FONT_LIST_DEFAULTS
} from '../defaults/font-list-defaults';

import {
  SkyTextEditorStyleState
} from '../types/style-state';

import {
  SkyTextEditorToolbarActionType
} from '../types/toolbar-action-type';

import {
  FONT_SIZE_LIST_DEFAULTS
} from '../defaults/font-size-list-defaults';

import {
  SkyTextEditorMenuType
} from '../types/menu-type';

import {
  SkyTextEditorMergeField
} from '../types/text-editor-merge-field';

/**
 * @internal
 */
@Component({
  selector: 'text-editor-reactive-test',
  templateUrl: './text-editor-reactive.component.fixture.html'
})
export class TextEditorReactiveFixtureComponent {
  public value: string = '<p>Some text</p>';
  public placeholder: string;

  public fontSizeList = FONT_SIZE_LIST_DEFAULTS;

  public fontList = FONT_LIST_DEFAULTS;

  public toolbarActions: SkyTextEditorToolbarActionType[] = [
    'font-family',
    'font-size',
    'color',
    'list',
    'font-style',
    'alignment',
    'indentation',
    'undo-redo',
    'link'
  ];

  public menus: SkyTextEditorMenuType[] = [
    'edit',
    'format',
    'merge-field'
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

  public initialStyleState: SkyTextEditorStyleState = {} as SkyTextEditorStyleState;

  public textEditorControl = new FormControl('');
  public textEditorForm = new FormGroup({
    'textEditorControl': this.textEditorControl
  });
}
