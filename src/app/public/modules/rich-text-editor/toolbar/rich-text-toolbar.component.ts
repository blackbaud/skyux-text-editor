import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
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
  SkyRichTextEditorUrlModalComponent
} from '../url-modal/url-modal.component';

import {
  UrlTarget
} from '../url-modal/url-target';

import {
  SkyRichTextEditorManagementService
} from '../services/rich-text-editor-management.service';

import {
  styleStateDefaults
} from '../defaults/style-state-defaults';

import {
  availableFontSizeList
} from '../types/available-font-size-list';

import {
  SkyUrlModalContext
} from '../url-modal/url-modal-context';

/**
 * @internal
 */
@Component({
  selector: 'sky-rich-text-toolbar',
  templateUrl: './rich-text-toolbar.component.html',
  styleUrls: ['./rich-text-toolbar.component.scss']
})
export class SkyRichTextToolbarComponent implements OnInit {
  public toolbarSectionEnum = SkyuxRichTextEditorToolbarSection;

  @Input()
  public editorId: string;

  @Input()
  public fontSizeList = availableFontSizeList;

  @Input()
  public fontList = availableFontList;

  @Input()
  public toolbarSections: SkyuxRichTextEditorToolbarSection[] = toolbarSectionDefaults;

  @Input()
  public get styleState(): SkyuxRichTextEditorStyleState {
    return this._styleState;
  }
  public set styleState(value: SkyuxRichTextEditorStyleState) {
    this._styleState = value;
  }
  private _styleState = styleStateDefaults;

  @Input()
  public editorFocusStream = new Subject();

  public colorpickerStream = new Subject<SkyColorpickerMessage>();
  public backColorpickerStream = new Subject<SkyColorpickerMessage>();

  constructor(
    private modalService: SkyModalService,
    private editorService: SkyRichTextEditorManagementService,
    private changeDetector: ChangeDetectorRef
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

  public execCommand(command: string, value: any = '') {
    this.editorService.execCommand(this.editorId, {
      command: command,
      value: value
    });
    this.styleState = {
      ...this.styleState,
      ...this.editorService.getStyleState(this.editorId)
    };
  }

  public toggleFontStyle(currentState: boolean, newState: boolean, command: string) {
    if (currentState !== newState) {
      this.execCommand(command);
    }
  }

  public link(): void {
    const priorSelection = this.editorService.saveSelection(this.editorId);
    const currentLink = this.editorService.getLink(this.editorId);
    const inputModal = this.modalService.open(SkyRichTextEditorUrlModalComponent, [{
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

  public changeFontSize(): void {
    this.editorService.setFontSize(this.editorId, this.styleState.fontSize);
    this.styleState = {
      ...this.styleState,
      ...this.editorService.getStyleState(this.editorId)
    };
  }

  public changeColor(color: SkyColorpickerOutput, isBackground = false): void {
    this.execCommand(isBackground ? 'backColor' : 'foreColor', color.hex);
  }

  private closeDropdowns() {
    const message: SkyColorpickerMessage = { type: SkyColorpickerMessageType.Close };
    this.colorpickerStream.next(message);
    this.backColorpickerStream.next(message);
  }
}
