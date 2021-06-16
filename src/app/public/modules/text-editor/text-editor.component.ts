import {
  Component,
  ViewEncapsulation,
  forwardRef,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
  Subject
} from 'rxjs';

import {
  MENUBAR_SECTION_DEFAULTS
} from './defaults/menubar-section-defaults';

import {
  STYLE_STATE_DEFAULTS
} from './defaults/style-state-defaults';

import {
  TOOLBAR_SECTION_DEFAULTS
} from './defaults/toolbar-section-defaults';

import {
  SkyTextEditorManagementService
} from './services/text-editor-management.service';

import {
  SkyTextMergeFieldService
} from './services/text-merge-field.service';

import {
  SkyTextSanitizationService
} from './services/text-sanitization.service';

import {
  SkyTextSelectionManagementService
} from './services/text-selection-management.service';

import {
  availableFontList
} from './types/available-font-list';

import {
  availableFontSizeList
} from './types/available-font-size-list';

import {
  SkyTextEditorMenubarSection
} from './types/menubar-section';

import {
  SkyTextEditorStyleState
} from './types/style-state';

import {
  SkyTextEditorMergeField
} from './types/text-editor-merge-field';

import {
  SkyTextEditorToolbarSection
} from './types/toolbar-section';

/**
 * Auto-incrementing integer used to generate unique ids for radio components.
 */
let nextUniqueId = 0;

@Component({
  selector: 'sky-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [
    SkyTextEditorManagementService,
    SkyTextMergeFieldService,
    SkyTextSelectionManagementService,
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line: no-forward-ref
      useExisting: forwardRef(() => SkyTextEditorComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SkyTextEditorComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {

  @Input()
  public autofocus: boolean = false;

  @Input()
  public fontList = availableFontList;

  @Input()
  public fontSizeList = availableFontSizeList;

  @Input()
  public id = `sky-text-editor-${++nextUniqueId}`;

  @Input()
  public mergeFields: SkyTextEditorMergeField[] = [];

  @Input()
  public menubarSections: SkyTextEditorMenubarSection[] = MENUBAR_SECTION_DEFAULTS;

  @Input()
  public set placeholder(value: string) {
    if (value !== this._placeholder) {
      this._placeholder = value;
      if (this.initialized) {
        this.editorService.setPlaceholder(this.id, value);
      }
    }
  }

  public get placeholder(): string {
    return this._placeholder;
  }

  @Input()
  public set styleState(state: SkyTextEditorStyleState) {
    // Do not update the state after initialization has taken place
    if (!this.initialized) {
      this._styleState = {
        ...STYLE_STATE_DEFAULTS,
        ...state
      };
    }
  }

  public get styleState(): SkyTextEditorStyleState {
    return this._styleState;
  }

  @Input()
  public toolbarSections: SkyTextEditorToolbarSection[] = TOOLBAR_SECTION_DEFAULTS;

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

  public get value(): string {
    return this._value;
  }

  public editorFocusStream = new Subject();

  @ViewChild('iframe')
  private iframeRef: ElementRef;

  private focusInitialized: boolean = false;

  private initialized: boolean = false;

  private _placeholder = '';

  private _styleState = Object.assign({}, STYLE_STATE_DEFAULTS);

  private _value: string = '<p></p>';

  constructor (
    private editorService: SkyTextEditorManagementService,
    private changeDetector: ChangeDetectorRef,
    private sanitizationService: SkyTextSanitizationService
  ) {}

  public ngAfterViewInit(): void {

    this.editorService.addEditor(
      this.id,
      this.iframeRef.nativeElement,
      this.styleState,
      this.placeholder
    );

    this.editorService.selectionChangeListener(this.id).subscribe(() => {
      this.updateValueAndStyle();
      this.editorFocusStream.next();
    });
    this.editorService.clickListener(this.id).subscribe(() => {
      this.editorFocusStream.next();
    });
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

  public onChange(): void {
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
