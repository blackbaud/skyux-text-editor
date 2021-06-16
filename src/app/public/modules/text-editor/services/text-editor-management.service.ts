import {
  Injectable
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  Observable,
  Subject
} from 'rxjs';

import {
  styleStateDefaults
} from '../defaults/style-state-defaults';

import {
  EditorCommand
} from '../types/editor-command';

import {
  EditorSetting
} from '../types/editor-setting';

import {
  SkyuxRichTextEditorStyleState
} from '../types/style-state';

import {
  UrlModalResult
} from '../url-modal/text-editor-url-modal-result';

import {
  UrlTarget
} from '../url-modal/text-editor-url-target';

import {
  SkyTextSelectionManagementService
} from './text-selection-management.service';

/**
 * @internal
 */
@Injectable()
export class SkyTextEditorManagementService {

  private editors: { [key: string]: EditorSetting } = {};

  constructor(
    private windowService: SkyAppWindowRef,
    private selectionService: SkyTextSelectionManagementService
  ) {}

  /**
   * Creates a text editor inside the supplied iframe element.
   */
  public addEditor(
    id: string,
    iframeElement: HTMLIFrameElement,
    styleState: SkyuxRichTextEditorStyleState,
    placeholder?: string
  ): void {
    if (!(id in this.editors)) {
      this.editors[id] = this.createObservers(id, iframeElement);

      const documentEl = this.getDocumentEl(id);

      const styleEl = documentEl.createElement('style');
      styleEl.innerHTML = `.editor:empty:before {
        content: attr(data-placeholder);
        font-family: "Blackbaud Sans", "Helvetica Neue", Arial, sans-serif;
        color: #686c73;
        font-weight: 400;
        font-size: 15px;
        font-style: italic;
      }`;
      documentEl.head.appendChild(styleEl);

      const style: SkyuxRichTextEditorStyleState = { ...styleStateDefaults, ...styleState };
      const bodyStyle = `background-color: ${style.backColor};
        color: ${style.fontColor};
        font-family: ${style.font};
        font-size: ${style.fontSize}px`;
      documentEl.querySelector('html').setAttribute('lang', 'en');
      documentEl.body.setAttribute('contenteditable', 'true');
      documentEl.body.setAttribute('id', id);
      documentEl.body.setAttribute('role', 'main');
      documentEl.body.setAttribute('class', 'editor');
      documentEl.body.setAttribute('style', bodyStyle);
      documentEl.body.setAttribute('data-placeholder', placeholder || '');
    }
  }

  public setPlaceholder(id: string, placeholder?: string): void {
    const documentEl = this.getDocumentEl(id);
    documentEl.body.setAttribute('data-placeholder', placeholder || '');
  }

  public removeEditor(id: string): void {
    if (id in this.editors) {
      SkyTextEditorManagementService.removeObservers(this.editors[id]);
      delete this.editors[id];
    }
  }

  public execCommand(id: string, editorCommand: EditorCommand): void {
    if (id in this.editors) {
      const documentEl = this.getDocumentEl(id);

      if (!this.editorSelected(documentEl)) {
        this.focusEditor(id);
      }

      if (this.editorSelected(documentEl)) {
        const commandIsSupportedAndEnabled = documentEl.execCommand(editorCommand.command, false, editorCommand.value);

        // IE11 doesn't support insertHTML
        /* istanbul ignore next */
        if (
          editorCommand.command.toLowerCase() === 'inserthtml' &&
          !commandIsSupportedAndEnabled
        ) {
          this.insertHtmlInIE11(id, editorCommand.value);
        }

        /* istanbul ignore next */
        if (!this.editorSelected(documentEl)) {
          this.focusEditor(id);
        }
        this.editors[id].commandChangeObservable.next();
      }
    }
  }

  public setFontSize(id: string, fontSize: number): void {
    const doc = this.getDocumentEl(id);
    this.execCommand(id, {command: 'fontSize', value: 1});
    const fontElements: HTMLElement[] = Array.from(doc.querySelectorAll('font[size="1"]'));
    for (let element of fontElements) {
      element.removeAttribute('size');
      element.style.fontSize = (fontSize + 'px');
    }
    SkyTextEditorManagementService.cleanUpBlankStyleTags(doc);

    /* istanbul ignore next */
    if (!this.editorSelected(doc)) {
      this.focusEditor(id);
    }
    this.editors[id].commandChangeObservable.next();
  }

  public selectionChangeListener(id: string): Observable<unknown> {
    return this.editors[id].selectionChangeObservable;
  }

  public clickListener(id: string): Observable<unknown> {
    return this.editors[id].clickObservable;
  }

  public commandChangeListener(id: string): Observable<unknown> {
    return this.editors[id].commandChangeObservable;
  }

  public getStyleState(id: string): Partial<SkyuxRichTextEditorStyleState> {
    const documentEl = this.getDocumentEl(id);

    if (this.editorSelected(documentEl)) {
      return {
        backColor: SkyTextEditorManagementService.getColor(documentEl, 'BackColor'),
        fontColor: SkyTextEditorManagementService.getColor(documentEl, 'ForeColor'),
        fontSize: parseInt(this.getFontSize(id), undefined),
        font: documentEl.queryCommandValue('fontname'),
        boldState: documentEl.queryCommandState('Bold'),
        italicState: documentEl.queryCommandState('Italic'),
        underlineState: documentEl.queryCommandState('Underline'),
        linkState: this.hasLink(id)
      };
    }

    /* istanbul ignore next */
    return {};
  }

  public getEditorInnerHtml(id: string): string {
    const documentEl = this.getDocumentEl(id);
    if (documentEl) {
      return this.replaceHtmlCodes(documentEl.body.innerHTML);
    }
    return '';
  }

  public setEditorInnerHtml(id: string, value: string): void {
    const documentEl = this.getDocumentEl(id);
    const editorContent = documentEl.body;
    if (editorContent.innerHTML !== value) {
      const previousSelection = this.selectionService.saveSelection(documentEl, this.getWindowEl(id));
      editorContent.innerHTML = value;
      this.selectionService.restoreSelection(documentEl, previousSelection, this.getWindowEl(id));
    }
  }

  public focusEditor(id: string): void {
    if (id in this.editors) {
      const windowEl = this.getWindowEl(id);
      const documentEl = this.windowService.nativeWindow.document;

      const editor: any = this.getDocumentEl(id).body;
      const range = documentEl.createRange();

      this.editors[id].iframeElementRef.focus();
      editor.focus();
      /* istanbul ignore else */
      if (windowEl.getSelection && documentEl.createRange) {
        range.selectNodeContents(editor);
        range.collapse(false);
        const sel = windowEl.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        const textRange = editor.createTextRange();
        textRange.moveToElementText(editor);
        textRange.collapse(false);
        textRange.select();
      }
    }
  }

  public getLink(editorId: string): UrlModalResult {
    let link: UrlModalResult = undefined;
    const anchorEl = this.getSelectedAnchorTag(editorId);
    if (anchorEl && anchorEl.href) {
      link = {
        target: anchorEl.getAttribute('target') === '_blank' ? UrlTarget.NewWindow : UrlTarget.None,
        url: anchorEl.href
      };
    }

    return link;
  }

  public getSelectedAnchorTag(editorId: string): HTMLAnchorElement {
    const selectedEl = this.getCurrentSelectionParentElement(editorId);

    return SkyTextEditorManagementService.getParent(selectedEl, 'a') as HTMLAnchorElement;
  }

  public getChildSelectedAnchorTags(editorId: string): Element[] {
    const selectedRange = this.getCurrentSelection(editorId).getRangeAt(0);
    if (selectedRange.toString().length <= 0) {
      return [];
    }

    const parentElement = this.getCurrentSelectionParentElement(editorId);
    const childElements = parentElement ? Array.from(parentElement.querySelectorAll('a')) : [];

    /* istanbul ignore next */
    return childElements.filter(element => {

      // IE specific
      if (!selectedRange.intersectsNode) {
        if (!element || !element.href) {
          return false;
        }
        const tempRange = document.createRange();
        tempRange.selectNodeContents(element);
        return (selectedRange.compareBoundaryPoints(Range.START_TO_START, tempRange) !== -1
          && selectedRange.compareBoundaryPoints(Range.START_TO_END, tempRange) !== 1) ||
          (selectedRange.compareBoundaryPoints(Range.END_TO_START, tempRange) !== -1
          && selectedRange.compareBoundaryPoints(Range.END_TO_END, tempRange) !== 1);
      }

      // Normal non-IE
      return !!element && !!element.href && selectedRange.intersectsNode(element);
    });
  }

  public getCurrentSelection(id: string): Selection {
    return this.selectionService.getCurrentSelection(this.getDocumentEl(id));
  }

  public getCurrentSelectionParentElement(id: string): Element {
    return this.selectionService.getCurrentSelectionParentElement(this.getDocumentEl(id));
  }

  public saveSelection(id: string): Range {
    return this.selectionService.saveSelection(this.getDocumentEl(id), this.getWindowEl(id));
  }

  public restoreSelection(id: string, range: Range): void {
    this.selectionService.restoreSelection(this.getDocumentEl(id), range, this.getWindowEl(id));
  }

  public selectElement(id: string, element: HTMLElement): void {
    this.selectionService.selectElement(this.getDocumentEl(id), this.getWindowEl(id), element);
  }

  private getWindowEl(id: string): Window {
    return this.editors[id].iframeElementRef.contentWindow;
  }

  private getDocumentEl(id: string): Document {
    /* istanbul ignore next */
    if (!(id in this.editors)) {
      return undefined;
    }

    if (this.editors[id].iframeElementRef.contentWindow) {
      return this.editors[id].iframeElementRef.contentWindow.document;
    }
    /* istanbul ignore next */
    return this.editors[id].iframeElementRef.contentDocument;
  }

  private getFontSize(id: string): string {
    /* istanbul ignore next */
    let fontSize = styleStateDefaults.fontSize.toString();
    const selection = this.getCurrentSelection(id);
    if (
      selection &&
      selection.anchorNode &&
      selection.anchorNode.parentElement
    ) {
      let element = selection.anchorNode;
      if (element.nodeType !== 1) {
        element = element.parentElement;
      }
      const computedStyle = window.getComputedStyle(element as Element);
      /* istanbul ignore else */
      if (computedStyle) {
        fontSize = computedStyle.getPropertyValue('font-size');
      }
    }
    return fontSize;
  }

  private createObservers(id: string, element: HTMLIFrameElement): EditorSetting {
    /* istanbul ignore next */
    const documentEl = element.contentWindow ?
      element.contentWindow.document :
      element.contentDocument;

    // Firefox bug where we need to open/close to cancel load so it doesn't overwrite attrs
    documentEl.open();
    documentEl.close();

    const selectionObservable = new Subject();
    const selectionListener = () => selectionObservable.next();
    const clickObservable = new Subject();
    const clickListener = () => clickObservable.next();
    const pasteListener = this.getPasteOverride(id);

    documentEl.addEventListener('selectionchange', selectionListener);
    documentEl.addEventListener('input', selectionListener);
    documentEl.addEventListener('mousedown', clickListener);
    documentEl.body.addEventListener('paste', pasteListener);
    return {
      iframeElementRef: element,
      selectionListener: selectionListener,
      clickListener: clickListener,
      pasteListener: pasteListener,
      selectionChangeObservable: selectionObservable,
      clickObservable: clickObservable,
      commandChangeObservable: new Subject()
    };
  }

  private static removeObservers(setting: EditorSetting): void {
    /* istanbul ignore next */
    const documentEl = setting.iframeElementRef.contentWindow ?
       setting.iframeElementRef.contentWindow.document :
       setting.iframeElementRef.contentDocument;
    setting.selectionChangeObservable.complete();
    setting.clickObservable.complete();
    setting.commandChangeObservable.complete();
    documentEl.removeEventListener('selectionchange', setting.selectionListener);
    documentEl.removeEventListener('input', setting.selectionListener);
    documentEl.removeEventListener('mousedown', setting.clickListener);
    documentEl.body.removeEventListener('paste', setting.pasteListener);
  }

  /* istanbul ignore next */
  private getPasteOverride(id: string): (e: ClipboardEvent) => void {
    return (e: ClipboardEvent): void => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      this.execCommand(id, { command: 'insertHTML', value: text });
    };
  }

  private static getColor(documentEl: Document, selector: string): string {
    const commandValue = documentEl.queryCommandValue(selector);

    // Edge is weird and returns numbers
    if (typeof commandValue === 'number') {
      /* istanbul ignore next */
      // tslint:disable-next-line: no-bitwise
      return 'rgb(' + (commandValue & 0xFF) + ', ' +
                    // tslint:disable-next-line: no-bitwise
                    ((commandValue & 0xFF00) >> 8) + ', ' +
                    // tslint:disable-next-line: no-bitwise
                    ((commandValue & 0xFF0000) >> 16 ) + ')';
    }

    // Firefox uses 'Transparent' instead of a color value
    /* istanbul ignore next */
    if (commandValue.toString().toLowerCase() === 'transparent') {
      return styleStateDefaults.backColor;
    }
    return commandValue;
  }

  private hasLink(editorId: string): boolean {
    const anchorEl = this.getSelectedAnchorTag(editorId);
    const childAnchorEls = this.getChildSelectedAnchorTags(editorId);
    return childAnchorEls.length > 0 || (!!anchorEl && !!anchorEl.href);
  }

  private static getParent(element: Element, tag: string): Element {
    let currentNode = element;
    while (currentNode && currentNode.tagName.toUpperCase() !== 'BODY') {
      if (currentNode.tagName.toUpperCase() === tag.toUpperCase()) {
        return currentNode;
      }
      currentNode = currentNode.parentElement;
    }
    return undefined;
  }

  private editorSelected(documentEl: Document): boolean {
    const editor: HTMLElement = documentEl.body;
    const selectedNode = this.selectionService.getCurrentSelection(documentEl).anchorNode;
    /* istanbul ignore next */
    return selectedNode &&
      (
        editor.contains(selectedNode) ||
        (selectedNode.parentNode && editor.contains(selectedNode.parentNode))
      );
  }

  /* istanbul ignore next */
  private insertHtmlInIE11(id: string, html: string): void {
    const documentEl = this.getDocumentEl(id);
    const windowEl = this.getWindowEl(id);
    const sel = windowEl.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
        let range = sel.getRangeAt(0);
        range.deleteContents();

        const el = documentEl.createElement('div');
        el.innerHTML = html;
        let frag = documentEl.createDocumentFragment(), node, lastNode;
        while (el.firstChild) {
          node = el.firstChild;
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        // Preserve the selection
        if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
  }

  private static cleanUpBlankStyleTags(doc: Document): void {
    const orphanElements: HTMLElement[] = Array.from(doc.querySelectorAll('font,span,*[style=""]'));
    for (let element of orphanElements) {
      if (!element.getAttribute('style')) {
        element.removeAttribute('style');
      }
    }
    const removableElements = orphanElements.filter(element => {
      const tagName = element.tagName.toUpperCase();
      return (tagName === 'FONT' || tagName === 'SPAN') &&
        (element.attributes.length === 0 || !element.hasChildNodes);
    });
    for (let element of removableElements) {
      const parent = element.parentNode;
      /* istanbul ignore else */
      if (parent) {
        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
      }
    }
  }

  // Certain values are encoded in html and need to be decoded
  private replaceHtmlCodes(str: string): string {
    return str.replace(/&nbsp;/, String.fromCharCode(160))
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }
}
