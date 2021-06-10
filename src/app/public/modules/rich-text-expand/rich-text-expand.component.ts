import {
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';

import {
  DomSanitizer, SafeHtml
} from '@angular/platform-browser';

import {
  SkyModalService
} from '@skyux/modals';

import {
  SkyRichTextExpandModalComponent
} from './rich-text-expand-modal/rich-text-expand-modal.component';

import {
  SkyRichTextExpandModalContext
} from './rich-text-expand-modal/rich-text-expand-modal-context';

import {
  SkyRichTextSanitizationService
} from '../rich-text-editor/services/rich-text-sanitization.service';

/**
 * Auto-incrementing integer used to generate unique ids for rich text expand components.
 */
let nextId = 0;

/**
 * @internal
 */
@Component({
  selector: 'sky-rich-text-expand',
  templateUrl: './rich-text-expand.component.html',
  styleUrls: ['./rich-text-expand.component.scss']
})
export class SkyRichTextExpandComponent {
  @Input()
  public expandModalTitle: string;

  @Input()
  public maxExpandedHeight: number = 400;

  @Input()
  public get maxHeight(): number {
    return this._maxHeight;
  }
  public set maxHeight(value: number) {
    this._maxHeight = value;
    this.setup(this.text);
  }

  @Input()
  public get text(): string {
    return this._text;
  }
  public set text(value: string) {
    const cleaned = this.sanitizationService.sanitize(value);
    if (cleaned !== this._text) {
      this.setup(value);
    }
  }
  private _text: string = '';

  public sanitizedText: SafeHtml = '';

  public contentSectionId: string = `sky-text-expand-content-${++nextId}`;

  public isExpanded: boolean;

  public expandable: boolean;

  public isModal: boolean;

  @ViewChild('text', {
    read: ElementRef,
    static: true
  })
  private textEl: ElementRef;

  private _maxHeight: number = 100;

  constructor(
    private modalService: SkyModalService,
    private sanitizer: DomSanitizer,
    private sanitizationService: SkyRichTextSanitizationService
  ) { }

  public textExpand(): void {
    if (this.isModal) {
      this.modalService.open(
        SkyRichTextExpandModalComponent,
        [
          {
            provide: SkyRichTextExpandModalContext,
            useValue: {
              header: this.expandModalTitle,
              displayValue: this.sanitizedText
            }
          }
        ]
      );
    } else {
      this.isExpanded = !this.isExpanded;
    }
  }

  private setup(value: string): void {
    /** istanbul ignore else */
    if (this.textEl) {
      this.sanitizedText = this.sanitizer.bypassSecurityTrustHtml(value);
      setTimeout(() => {
        this.isModal = this.textEl.nativeElement.scrollHeight > this.maxExpandedHeight;
        this.expandable = this.textEl.nativeElement.scrollHeight > this.maxHeight;
      });
    }
  }
}
