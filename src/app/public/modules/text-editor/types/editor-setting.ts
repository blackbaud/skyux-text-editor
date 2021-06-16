import {
  Subject
} from 'rxjs';

/**
 * @internal
 */
export interface EditorSetting {
  iframeElementRef: HTMLIFrameElement;
  selectionListener: () => void;
  clickListener: () => void;
  pasteListener: (e: ClipboardEvent) => void;
  selectionChangeObservable: Subject<unknown>;
  clickObservable: Subject<unknown>;
  commandChangeObservable: Subject<unknown>;
}
