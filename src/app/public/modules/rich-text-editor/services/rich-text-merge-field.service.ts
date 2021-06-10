import {
  Injectable
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyRichTextMergeFieldService {
  constructor(
    private windowService: SkyAppWindowRef
  ) { }

  public makeImageFromText(text: string): string {
    const documentEl = this.windowService.nativeWindow.document;
    let textToUse = text;
    if (text.length > 18) {
      textToUse = text.substr(0, 15) + '...';
    }

    const canvasElement = documentEl.createElement('canvas');
    canvasElement.setAttribute('height', '20');
    canvasElement.setAttribute('width', '100');
    canvasElement.style.backgroundColor = 'tan';
    canvasElement.style.border = '1px solid #000000';
    canvasElement.style.borderRadius = '5px';

    const context = canvasElement.getContext('2d');
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.fillText(textToUse, 50, 15);

    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = '#00FFFF';
    context.fillRect(0, 0, 100, 20);

    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 2;
    context.strokeStyle = '#FF0000';
    context.strokeRect(0, 0, 100, 20);

    const result = canvasElement.toDataURL('image/png', 1.0);
    return result;
  }
}
