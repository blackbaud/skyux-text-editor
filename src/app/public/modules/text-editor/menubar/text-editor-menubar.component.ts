import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyuxRichTextEditorMenubarSection
} from '../types/menubar-section';

import {
  menubarSectionDefaults
} from '../defaults/menubar-section-defaults';

import {
  SkyTextEditorManagementService
} from '../services/text-editor-management.service';

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
  encapsulation: ViewEncapsulation.None
})
export class SkyTextEditorMenubarComponent implements OnInit {

  @Input()
  public editorFocusStream = new Subject();

  @Input()
  public editorId: string;

  @Input()
  public menubarSections: SkyuxRichTextEditorMenubarSection[] = menubarSectionDefaults;

  @Input()
  public mergeFields: SkyTextEditorMergeField[] = [];

  public editDropdownStream = new Subject<SkyDropdownMessage>();

  public editItems = [
    {
      function: () => this.execCommand('undo'),
      icon: 'undo',
      label: 'Undo',
      greyText: 'Ctrl+Z'
    },
    {
      function: () => this.execCommand('redo'),
      icon: 'repeat',
      label: 'Redo',
      greyText: 'Ctrl+Y'
    },
    {
      isDivider: true
    },
    {
      function: () => this.execCommand('cut'),
      icon: 'cut',
      label: 'Cut',
      greyText: 'Ctrl+X'
    },
    {
      function: () => this.execCommand('copy'),
      icon: 'copy',
      label: 'Copy',
      greyText: 'Ctrl+C'
    },
    {
      function: () => this.execCommand('paste'),
      icon: 'paste',
      label: 'Paste',
      greyText: 'Ctrl+V'
    },
    {
      isDivider: true
    },
    {
      function: () => this.execCommand('selectAll'),
      label: 'Select all',
      greyText: 'Ctrl+A'
    }
  ];

  public formatDropdownStream = new Subject<SkyDropdownMessage>();

  public formatItems = [
    {
      function: () => this.execCommand('bold'),
      icon: 'bold',
      label: 'Bold',
      greyText: 'Ctrl+B'
    },
    {
      function: () => this.execCommand('italic'),
      icon: 'italic',
      label: 'Italic',
      greyText: 'Ctrl+I'
    },
    {
      function: () => this.execCommand('underline'),
      icon: 'underline',
      label: 'Underline',
      greyText: 'Ctrl+U'
    },
    {
      function: () => this.execCommand('strikethrough'),
      icon: 'strikethrough',
      label: 'Strikethrough'
    },
    {
      isDivider: true
    },
    {
      function: () => this.clearFormat(),
      icon: 'remove-format',
      label: 'Clear formatting'
    }
  ];

  public menubarSectionEnum = SkyuxRichTextEditorMenubarSection;

  public mergeFieldDropdownStream = new Subject<SkyDropdownMessage>();

  constructor(
    private editorService: SkyTextEditorManagementService,
    private mergeFieldService: SkyTextMergeFieldService
  ) {}

  public ngOnInit(): void {
    this.editorFocusStream.subscribe(() => {
      this.closeDropdowns();
    });
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
