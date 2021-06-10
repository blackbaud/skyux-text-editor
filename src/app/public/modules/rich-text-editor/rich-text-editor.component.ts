import {
  Component,
  ViewEncapsulation,
  forwardRef,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
  Subject
} from 'rxjs';
import { availableFontList } from './types/available-font-list';

import {
  SkyuxRichTextEditorStyleState
} from './types/style-state';

import {
  SkyRichTextEditorMergeField
} from './types/rich-text-editor-merge-field';

import {
  SkyuxRichTextEditorToolbarSection
} from './types/toolbar-section';

import {
  toolbarSectionDefaults
} from './defaults/toolbar-section-defaults';

import {
  styleStateDefaults
} from './defaults/style-state-defaults';

import {
  SkyRichTextEditorManagementService
} from './services/rich-text-editor-management.service';

import {
  SkyuxRichTextEditorMenubarSection
} from './types/menubar-section';

import {
  menubarSectionDefaults
} from './defaults/menubar-section-defaults';

import {
  availableFontSizeList
} from './types/available-font-size-list';

import {
  SkyRichTextSanitizationService
} from './services/rich-text-sanitization.service';

/**
 * Auto-incrementing integer used to generate unique ids for radio components.
 */
let nextUniqueId = 0;

/**
 * @internal
 */
@Component({
  selector: 'sky-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line: no-forward-ref
      useExisting: forwardRef(() => SkyRichTextEditorComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class SkyRichTextEditorComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {
  @Input()
  public autofocus: boolean = false;

  @Input()
  public id = `sky-rich-text-editor-${++nextUniqueId}`;

  @Input()
  public menubarSections: SkyuxRichTextEditorMenubarSection[] = menubarSectionDefaults;

  @Input()
  public fontSizeList = availableFontSizeList;

  @Input()
  public fontList = availableFontList;

  @Input()
  public toolbarSections: SkyuxRichTextEditorToolbarSection[] = toolbarSectionDefaults;

  @Input()
  public mergeFields: SkyRichTextEditorMergeField[] = [];

  @Input()
  public get styleState(): SkyuxRichTextEditorStyleState {
    return this._styleState;
  }
  public set styleState(state: SkyuxRichTextEditorStyleState) {
    // Do not update the state after initialization has taken place
    if (!this.initialized) {
      this._styleState = {
        ...styleStateDefaults,
        ...state
      };
    }
  }
  private _styleState = Object.assign({}, styleStateDefaults);

  @Input()
  public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(value: string) {
    if (value !== this._placeholder) {
      this._placeholder = value;
      if (this.initialized) {
        this.editorService.setPlaceholder(this.id, value);
      }
    }
  }
  private _placeholder = '';

  public editorFocusStream = new Subject();

  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    // Set clear state to be an empty string
    let valueString: string = value;
    if (!value || (value.trim() === '<p></p>' && value.trim() === '<br>')) {
      valueString = '';
    }
    valueString = this.sanitizationService.sanitize(valueString);

    if (this._value !== valueString) {
      this._value = valueString.trim();

      // initial focus
      /* istanbul ignore next */
      if (this.autofocus && !this.focusInitialized) {
        this.editorService.focusEditor(this.id);
        this.focusInitialized = true;
      }
      this.onChange();
    }
  }
  private _value: string = '<p></p>';

  @ViewChild('iframe')
  private editorRef: ElementRef;

  private focusInitialized: boolean = false;
  private initialized: boolean = false;

  constructor (
    private editorService: SkyRichTextEditorManagementService,
    private changeDetector: ChangeDetectorRef,
    private sanitizationService: SkyRichTextSanitizationService
  ) { }

  public ngAfterViewInit(): void {
    this.editorService.addEditor(this.id, this.editorRef.nativeElement, this.styleState, this.placeholder);
    this.editorService.selectionChangeListener(this.id).subscribe(() => {
      this.updateValueAndStyle();
      this.editorFocusStream.next();
    });
    this.editorService.clickListener(this.id).subscribe(() =>
      this.editorFocusStream.next()
    );
    this.editorService.commandChangeListener(this.id).subscribe(() => {
      this.updateValueAndStyle();
    });
    this.editorService.setEditorInnerHtml(this.id, this._value);
    /* istanbul ignore next */
    if (this.autofocus) {
      this.editorService.focusEditor(this.id);
    }
    this.initialized = true;
  }

  public ngOnDestroy(): void {
    this.editorService.removeEditor(this.id);
  }

  public writeValue(obj: string): void {
    this.value = obj;

    // Update html if necessary
    const editorValue = this.editorService.getEditorInnerHtml(this.id);
    if (this.initialized && editorValue !== this._value) {
      this.editorService.setEditorInnerHtml(this.id, this._value);
    }
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public onChange() {
    this._onChange(this.value);
  }

  public updateValueAndStyle(): void {
    this.value = this.editorService.getEditorInnerHtml(this.id);
    this._styleState = {
      ...this._styleState,
      ...this.editorService.getStyleState(this.id) as any
    };
    this.changeDetector.detectChanges();
  }

  /* istanbul ignore next */
  public onTouch = () => {};

  /* istanbul ignore next */
  private _onChange = (_: string) => {};
}
