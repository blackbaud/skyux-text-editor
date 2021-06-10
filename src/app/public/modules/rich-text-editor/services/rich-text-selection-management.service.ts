import {
  Injectable
} from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyRichTextSelectionManagementService {

  constructor() {}

  public getCurrentSelection(documentEl: Document): Selection {
    return documentEl.getSelection();
  }

  public getCurrentSelectionParentElement(documentEl: Document): Element {
    const selection = this.getCurrentSelection(documentEl);
    let selectedEl: Element;
    /* istanbul ignore else */
    if (selection &&
        selection.getRangeAt &&
        selection.getRangeAt(0).commonAncestorContainer
    ) {
      selectedEl = selection.getRangeAt(0).commonAncestorContainer as Element;
      selectedEl = selectedEl.nodeType !== 1 ? selectedEl.parentElement : selectedEl;
    } else if (selection && selection.type !== 'Control') {
        selectedEl = (selection as any).createRange().parentElement();
    } else {
      return undefined;
    }
    return selectedEl;
  }

  public saveSelection(documentEl: Document, windowEl: Window): Range {
    /* istanbul ignore else */
    if (windowEl.getSelection) {
      const sel = windowEl.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    } else if (documentEl.getSelection() && documentEl.getSelection().getRangeAt) {
      return documentEl.getSelection().getRangeAt(0);
    }
    return undefined;
  }

  public restoreSelection(documentEl: Document, selectedRange: Range, windowEl: Window): void {
    if (selectedRange) {
      /* istanbul ignore else */
      if (windowEl.getSelection) {
        const sel = windowEl.getSelection();
        sel.removeAllRanges();
        sel.addRange(selectedRange);
      } else if (documentEl.getSelection) {
        const sel = documentEl.getSelection();
        sel.removeAllRanges();
        sel.addRange(selectedRange);
      }
    }
  }

  public selectElement(documentEl: Document, windowEl: Window, element: HTMLElement): void {
    if (element) {
      /* istanbul ignore else */
      if (windowEl.getSelection) {
        const sel = windowEl.getSelection();
        sel.removeAllRanges();
        const range = documentEl.createRange();
        range.selectNodeContents(element);
        sel.addRange(range);
      } else if (documentEl.getSelection) {
        const sel = documentEl.getSelection();
        sel.removeAllRanges();
        const range = documentEl.createRange();
        range.selectNodeContents(element);
        sel.addRange(range);
      }
    }
  }
}
