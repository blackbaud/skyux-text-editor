import {
  Component,
  Input
} from '@angular/core';

import {
  DomSanitizer, SafeHtml
} from '@angular/platform-browser';

import {
  SkyRichTextSanitizationService
} from '../rich-text-editor/services/rich-text-sanitization.service';

/**
 * @internal
 */
@Component({
  selector: 'sky-rich-text-display',
  templateUrl: './rich-text-display.component.html'
})
export class SkyRichTextDisplayComponent {
  @Input()
  public set text(value: string) {
    const cleaned = this.sanitizationService.sanitize(value);
    if (cleaned !== this._text) {
      this.setup(value);
    }
  }
  private _text: string = '';

  public sanitizedText: SafeHtml = '';

  constructor(
    private sanitizer: DomSanitizer,
    private sanitizationService: SkyRichTextSanitizationService
  ) { }

  private setup(value: string): void {
    this.sanitizedText = this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
