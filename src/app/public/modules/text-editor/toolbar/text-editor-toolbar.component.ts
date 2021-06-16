import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyColorpickerOutput,
  SkyColorpickerMessage,
  SkyColorpickerMessageType
} from '@skyux/colorpicker';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers';

import {
  SkyuxRichTextEditorStyleState
} from '../types/style-state';

import {
  availableFontList
} from '../types/available-font-list';

import {
  SkyuxRichTextEditorToolbarSection
} from '../types/toolbar-section';

import {
  toolbarSectionDefaults
} from '../defaults/toolbar-section-defaults';

import {
  SkyTextEditorUrlModalComponent
} from '../url-modal/text-editor-url-modal.component';

import {
  UrlTarget
} from '../url-modal/text-editor-url-target';

import {
  SkyTextEditorManagementService
} from '../services/text-editor-management.service';

import {
  styleStateDefaults
} from '../defaults/style-state-defaults';

import {
  availableFontSizeList
} from '../types/available-font-size-list';

import {
  SkyUrlModalContext
} from '../url-modal/text-editor-url-modal-context';

/**
 * @internal
 */
@Component({
  selector: 'sky-text-editor-toolbar',
  templateUrl: './text-editor-toolbar.component.html',
  styleUrls: ['./text-editor-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SkyTextEditorToolbarComponent implements OnInit {

  @Input()
  public editorFocusStream = new Subject();

  @Input()
  public editorId: string;

  @Input()
  public fontList = availableFontList;

  @Input()
  public fontSizeList = availableFontSizeList;

  @Input()
  public toolbarSections: SkyuxRichTextEditorToolbarSection[] = toolbarSectionDefaults;

  @Input()
  public get styleState(): SkyuxRichTextEditorStyleState {
    return this._styleState;
  }
  public set styleState(value: SkyuxRichTextEditorStyleState) {
    this._styleState = value;
    if (value.font !== this.styleStateFontName) {
      this.styleStateFontName = this.getFontName(value.font);
    }
  }

  public backColorpickerStream = new Subject<SkyColorpickerMessage>();

  public colorpickerStream = new Subject<SkyColorpickerMessage>();

  public fontPickerStream = new Subject<SkyDropdownMessage>();

  public fontSizeStream = new Subject<SkyDropdownMessage>();

  public styleStateFontName: string;

  public toolbarSectionEnum = SkyuxRichTextEditorToolbarSection;

  private _styleState = styleStateDefaults;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private editorService: SkyTextEditorManagementService,
    private modalService: SkyModalService
  ) {}

  public ngOnInit(): void {
    this.editorFocusStream.subscribe(() => {
      this.styleState = {
        ...this._styleState,
        ...this.editorService.getStyleState(this.editorId) as any
      };
      this.closeDropdowns();
      this.changeDetector.detectChanges();
    });
  }

  public execCommand(command: string, value: any = ''): void {
    this.editorService.execCommand(this.editorId, {
      command: command,
      value: value
    });
    this.styleState = {
      ...this.styleState,
      ...this.editorService.getStyleState(this.editorId)
    };
  }

  public toggleFontStyle(currentState: boolean, newState: boolean, command: string): void {
    if (currentState !== newState) {
      this.execCommand(command);
    }
  }

  public link(): void {
    const priorSelection = this.editorService.saveSelection(this.editorId);
    const currentLink = this.editorService.getLink(this.editorId);
    const inputModal = this.modalService.open(SkyTextEditorUrlModalComponent, [{
      provide: SkyUrlModalContext,
      useValue: { urlResult: currentLink }
    }]);
    inputModal.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save' && priorSelection) {
        if (!currentLink) {
          this.editorService.restoreSelection(this.editorId, priorSelection);
        } else {
          const anchor = this.editorService.getSelectedAnchorTag(this.editorId);
          this.editorService.selectElement(this.editorId, anchor);
        }

        this.execCommand('unlink');
        if (result.data.target === UrlTarget.None) {
          // Current window
          this.execCommand('createLink', result.data.url);
        } else {
          // New Window
          const sText = this.editorService.getCurrentSelection(this.editorId);
          this.execCommand('insertHTML', '<a href="' + result.data.url + '" rel="noopener noreferrer" target="_blank">' + sText + '</a>');
        }
      }
    });
  }

  public unlink(): void {
    let currentSelectionRange = this.editorService.getCurrentSelection(this.editorId).getRangeAt(0);
    if (currentSelectionRange.toString().length <= 0) {
      const anchorTag = this.editorService.getSelectedAnchorTag(this.editorId);
      this.editorService.selectElement(this.editorId, anchorTag);
    }
    this.execCommand('unlink');
  }

  public changeFontSize(size: number): void {
    this.editorService.setFontSize(this.editorId, size);
    this.styleState = {
      ...this.styleState,
      ...this.editorService.getStyleState(this.editorId)
    };
  }

  public onColorpickerColorChanged(color: SkyColorpickerOutput, isBackground = false): void {
    this.execCommand(isBackground ? 'backColor' : 'foreColor', color.hex);
  }

  private closeDropdowns(): void {
    const message: SkyColorpickerMessage = { type: SkyColorpickerMessageType.Close };
    this.colorpickerStream.next(message);
    this.backColorpickerStream.next(message);
    this.fontPickerStream.next({ type: SkyDropdownMessageType.Close });
    this.fontSizeStream.next({ type: SkyDropdownMessageType.Close });
  }

  private getFontName(font: string): string {
    for (let i = 0; i < availableFontList.length; i++) {
      if (availableFontList[i].value === font) {
          return availableFontList[i].name;
      }
    }
  }
}
