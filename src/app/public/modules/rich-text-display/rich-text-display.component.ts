import {
  Component,
  Input
} from '@angular/core';

import {
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

import {
  SkyTextSanitizationService
} from '../text-editor/services/text-sanitization.service';

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

  public sanitizedText: SafeHtml = '';

  private _text: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private sanitizationService: SkyTextSanitizationService
  ) { }

  private setup(value: string): void {
    this.sanitizedText = this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
