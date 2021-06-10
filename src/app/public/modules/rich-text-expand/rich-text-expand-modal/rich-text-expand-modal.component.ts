import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkyRichTextExpandModalContext
} from './rich-text-expand-modal-context';

/**
 * @internal
 */
@Component({
  selector: 'sky-rich-text-expand-modal',
  templateUrl: './rich-text-expand-modal.component.html'
})
export class SkyRichTextExpandModalComponent {
  constructor(
    public context: SkyRichTextExpandModalContext,
    private instance: SkyModalInstance
  ) { }

  public close(): void {
    this.instance.close();
  }
}
