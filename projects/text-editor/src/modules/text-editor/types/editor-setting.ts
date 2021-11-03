import {
  Subject
} from 'rxjs';

/**
 * @internal
 */
export interface EditorSetting {
  blurObservable: Subject<unknown>;
  clickObservable: Subject<unknown>;
  commandChangeObservable: Subject<unknown>;
  iframeElementRef: HTMLIFrameElement;
  selectionChangeObservable: Subject<unknown>;
  blurListener: () => void;
  clickListener: () => void;
  selectionListener: () => void;
  pasteListener: (e: ClipboardEvent) => void;
}
