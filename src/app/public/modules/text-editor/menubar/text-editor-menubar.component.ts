import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyTextEditorMenubarAction
} from '../types/menubar-action';

import {
  SkyTextEditorService
} from '../services/text-editor.service';

import {
  SkyTextEditorMergeField
} from '../types/text-editor-merge-field';

import {
  SkyTextMergeFieldService
} from '../services/text-merge-field.service';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers';

/**
 * @internal
 */
@Component({
  selector: 'sky-text-editor-menubar',
  templateUrl: './text-editor-menubar.component.html',
  styleUrls: ['./text-editor-menubar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SkyTextEditorMenubarComponent implements OnDestroy, OnInit {

  @Input()
  public editorFocusStream = new Subject();

  @Input()
  public editorId: string;

  @Input()
  public menubarActions: SkyTextEditorMenubarAction[] = [];

  @Input()
  public mergeFields: SkyTextEditorMergeField[] = [];

  public editDropdownStream = new Subject<SkyDropdownMessage>();

  public editItems = [
    {
      function: () => this.execCommand('undo'),
      label: 'Undo',
      keyShortcut: 'Ctrl+Z'
    },
    {
      function: () => this.execCommand('redo'),
      label: 'Redo',
      keyShortcut: 'Ctrl+Y'
    },
    {
      isDivider: true
    },
    {
      function: () => this.execCommand('cut'),
      label: 'Cut',
      keyShortcut: 'Ctrl+X'
    },
    {
      function: () => this.execCommand('copy'),
      label: 'Copy',
      keyShortcut: 'Ctrl+C'
    },
    {
      function: () => this.execCommand('paste'),
      label: 'Paste',
      keyShortcut: 'Ctrl+V'
    },
    {
      isDivider: true
    },
    {
      function: () => this.execCommand('selectAll'),
      label: 'Select all',
      keyShortcut: 'Ctrl+A'
    }
  ];

  public formatDropdownStream = new Subject<SkyDropdownMessage>();

  public formatItems = [
    {
      function: () => this.execCommand('bold'),
      label: 'Bold',
      keyShortcut: 'Ctrl+B'
    },
    {
      function: () => this.execCommand('italic'),
      label: 'Italic',
      keyShortcut: 'Ctrl+I'
    },
    {
      function: () => this.execCommand('underline'),
      label: 'Underline',
      keyShortcut: 'Ctrl+U'
    },
    {
      function: () => this.execCommand('strikethrough'),
      label: 'Strikethrough'
    },
    {
      isDivider: true
    },
    {
      function: () => this.clearFormat(),
      label: 'Clear formatting'
    }
  ];

  public menubarActionEnum = SkyTextEditorMenubarAction;

  public mergeFieldDropdownStream = new Subject<SkyDropdownMessage>();

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private editorService: SkyTextEditorService,
    private mergeFieldService: SkyTextMergeFieldService
  ) {}

  public ngOnInit(): void {
    this.editorFocusStream
      .pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe(() => {
        this.closeDropdowns();
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public execCommand(command: string, value: any = ''): void {
    this.editorService.execCommand(this.editorId, {
      command: command,
      value: value
    });
  }

  public insertMergeField(field: SkyTextEditorMergeField): void {
    this.execCommand(
      'insertHTML',
      '<img style="display: inline; cursor: grab;" data-fieldid="' + field.id +
        '" data-fielddisplay="' + field.name +
        '" src="' + (field.previewImageUrl || this.mergeFieldService.makeImageFromText(field.name)) + '">'
    );
  }

  private closeDropdowns(): void {
    this.editDropdownStream.next({ type: SkyDropdownMessageType.Close });
    this.formatDropdownStream.next({ type: SkyDropdownMessageType.Close });
    this.mergeFieldDropdownStream.next({ type: SkyDropdownMessageType.Close });
  }

  private clearFormat(): void {
    let currentSelection = this.editorService.getCurrentSelection(this.editorId);
    if (currentSelection.rangeCount > 0 && currentSelection.getRangeAt(0).toString().length <= 0) {
      this.execCommand('selectAll');
    }
    this.execCommand('removeFormat');
  }

}
