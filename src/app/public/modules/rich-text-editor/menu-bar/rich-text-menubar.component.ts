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
  SkyRichTextEditorManagementService
} from '../services/rich-text-editor-management.service';

import {
  SkyRichTextEditorMergeField
} from '../types/rich-text-editor-merge-field';

import {
  SkyRichTextMergeFieldService
} from '../services/rich-text-merge-field.service';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers';

/**
 * @internal
 */
@Component({
  selector: 'sky-rich-text-menubar',
  templateUrl: './rich-text-menubar.component.html',
  styleUrls: ['./rich-text-menubar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SkyRichTextMenubarComponent implements OnInit {
  public menubarSectionEnum = SkyuxRichTextEditorMenubarSection;

  @Input()
  public editorId: string;

  @Input()
  public mergeFields: SkyRichTextEditorMergeField[] = [];

  @Input()
  public menubarSections: SkyuxRichTextEditorMenubarSection[] = menubarSectionDefaults;

  @Input()
  public editorFocusStream = new Subject();

  public editDropdownStream = new Subject<SkyDropdownMessage>();
  public formatDropdownStream = new Subject<SkyDropdownMessage>();
  public mergeFieldDropdownStream = new Subject<SkyDropdownMessage>();

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

  constructor(
    private editorService: SkyRichTextEditorManagementService,
    private mergeFieldService: SkyRichTextMergeFieldService
  ) {}

  public ngOnInit(): void {
    this.editorFocusStream.subscribe(() => {
      this.closeDropdowns();
    });
  }

  public execCommand(command: string, value: any = '') {
    this.editorService.execCommand(this.editorId, {
      command: command,
      value: value
    });
  }

  public insertMergeField(field: SkyRichTextEditorMergeField) {
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
