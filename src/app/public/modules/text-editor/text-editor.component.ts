import {
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
  takeUntil
} from 'rxjs/operators';

import {
  Subject
} from 'rxjs';

import {
  SkyCoreAdapterService
} from '@skyux/core';

import {
  MENU_DEFAULTS
} from './defaults/menu-defaults';

import {
  STYLE_STATE_DEFAULTS
} from './defaults/style-state-defaults';

import {
  TOOLBAR_ACTION_DEFAULTS
} from './defaults/toolbar-action-defaults';

import {
  SkyTextEditorAdapterService
} from './services/text-editor-adapter.service';

import {
  SkyTextEditorService
} from './services/text-editor.service';

import {
  SkyTextSanitizationService
} from './services/text-sanitization.service';

import {
  FONT_LIST_DEFAULTS
} from './defaults/font-list-defaults';

import {
  FONT_SIZE_LIST_DEFAULTS
} from './defaults/font-size-list-defaults';

import {
  SkyTextEditorFont
} from './types/font-state';

import {
  SkyTextEditorMenuType
} from './types/menu-type';

import {
  SkyTextEditorStyleState
} from './types/style-state';

import {
  SkyTextEditorMergeField
} from './types/text-editor-merge-field';

import {
  SkyTextEditorToolbarActionType
} from './types/toolbar-action-type';

import {
  SkyFormsUtility
} from '../shared/forms-utility';

/**
 * Auto-incrementing integer used to generate unique ids for radio components.
 */
let nextUniqueId = 0;

/**
 * The text editor component lets users format and manipulate text.
 */
@Component({
  selector: 'sky-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [
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

  /**
   * Indicates whether to put focus on the editor after it renders.
   */
  @Input()
  public autofocus: boolean = false;

  /**
   * Indicates whether to disable the text editor.
   * @default false
   */
  @Input()
  public set disabled(value: boolean) {
    const coercedValue = SkyFormsUtility.coerceBooleanProperty(value);
    if (coercedValue !== this.disabled) {
      this._disabled = coercedValue;
      this.changeDetector.markForCheck();
      this.adapterService.toggleEditorAbility(this.id, this._disabled, this.focusableChildren);
    }
  }

  public get disabled() {
    return this._disabled;
  }

  public editorFocusStream = new Subject();

  // tslint:disable: max-line-length
  /**
   * Specifies the fonts to include in the font picker.
   * @default [{name: 'Blackbaud Sans', value: '"Blackbaud Sans", Arial, sans-serif'}, {name: 'Arial', value: 'Arial'}, {name: 'Arial Black', value: '"Arial Black"'}, {name: 'Courier New', value: '"Courier New"'}, {name: 'Georgia', value: 'Georgia, serif'}, {name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif'}, {name: 'Times New Roman', value: '"Times New Roman"'}, {name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif'}, {name: 'Verdana', value: 'Verdana, Geneva, sans-serif'}]
   */
  // tslint:enable: max-line-length
  @Input()
  public fontList: SkyTextEditorFont[] = FONT_LIST_DEFAULTS;

  /**
   * Specifies the font sizes to include in the font size picker.
   * @default [6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 36, 48]
   */
  @Input()
  public fontSizeList: number[] = FONT_SIZE_LIST_DEFAULTS;

  /**
   * Specifies a unique ID attribute for the text editor.
   * By default, the component generates a random ID.
   */
  @Input()
  public id = `sky-text-editor-${++nextUniqueId}`;

  /**
   * Specifies the initial styles for all content, including background color, font size, and link state.
   */
   @Input()
   public set initialStyleState(state: SkyTextEditorStyleState) {
     // Do not update the state after initialization has taken place
     if (!this.initialized) {
       this._initialStyleState = {
         ...STYLE_STATE_DEFAULTS,
         ...state
       };
     }
   }

   public get initialStyleState(): SkyTextEditorStyleState {
     return this._initialStyleState;
   }

  /**
   * Specifies the menus to include in the menu bar.
   * @default [ 'edit', 'format' ]
   */
  @Input()
  public menus: SkyTextEditorMenuType[] = MENU_DEFAULTS;

  /**
   * Specifies the merge fields to include in the merge field menu.
   */
  @Input()
  public mergeFields: SkyTextEditorMergeField[] = [];

  /**
   * Specifies placeholder text to display when the text entry area is empty.
   */
  @Input()
  public set placeholder(value: string) {
    if (value !== this._placeholder) {
      this._placeholder = value;
      if (this.initialized) {
        this.adapterService.setPlaceholder(this.id, value);
      }
    }
  }

  public get placeholder(): string {
    return this._placeholder;
  }

  // tslint:disable: max-line-length
  /**
   * Specifies the actions to include in the toolbar and determines their order.
   * @default [ 'font-family', 'font-size', 'font-style', 'color', 'list', 'link ]
   */
  // tslint:enable: max-line-length
  @Input()
  public toolbarActions: SkyTextEditorToolbarActionType[] = TOOLBAR_ACTION_DEFAULTS;

  public set value(value: string) {
    // Set clear state to be an empty string
    let valueString: string = value;
    if (!value || (value.trim() === '<p></p>' && value.trim() === '<br>')) {
      valueString = '';
    }
    valueString = this.sanitizationService.sanitize(valueString).trim();

    if (this._value !== valueString) {
      this._value = valueString;

      // Autofocus isn't testable in Firefox and IE.
      /* istanbul ignore next */
      if (this.autofocus && !this.focusInitialized) {
        this.adapterService.focusEditor(this.id);
        this.focusInitialized = true;
      }
      this.onChange();
    }
  }

  public get value(): string {
    return this._value;
  }

  private focusableChildren: HTMLElement[];

  private focusInitialized: boolean = false;

  @ViewChild('iframe')
  private iframeRef: ElementRef;

  private initialized: boolean = false;

  private ngUnsubscribe = new Subject<void>();

  private _disabled: boolean = false;

  private _initialStyleState = Object.assign({}, STYLE_STATE_DEFAULTS);

  private _placeholder = '';

  private _value: string = '<p></p>';

  constructor (
    private changeDetector: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private adapterService: SkyTextEditorAdapterService,
    private editorService: SkyTextEditorService,
    private sanitizationService: SkyTextSanitizationService
  ) {}

  public ngAfterViewInit(): void {
    this.adapterService.addEditor(
      this.id,
      this.iframeRef.nativeElement,
      this.initialStyleState,
      this.placeholder
    );

    this.editorService.selectionChangeListener(this.id)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.updateValueAndStyle();
        this.editorFocusStream.next();
      });

    this.editorService.clickListener(this.id)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.editorFocusStream.next();
      });

    this.editorService.commandChangeListener(this.id)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.updateValueAndStyle();
      });

    this.adapterService.setEditorInnerHtml(this.id, this._value);

    /* istanbul ignore next */
    if (this.autofocus) {
      this.adapterService.focusEditor(this.id);
    }

    this.focusableChildren = this.coreAdapterService.getFocusableChildren(this.iframeRef.nativeElement, {
      ignoreVisibility: true
    });

    this.initialized = true;
  }

  public ngOnDestroy(): void {
    this.adapterService.removeObservers(this.editorService.editors[this.id]);
    this.editorService.removeEditor(this.id);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public writeValue(obj: string): void {
    this.value = obj;

    // Update HTML if necessary.
    const editorValue = this.adapterService.getEditorInnerHtml(this.id);
    if (this.initialized && editorValue !== this._value) {
      this.adapterService.setEditorInnerHtml(this.id, this._value);
    }
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onChange(): void {
    this._onChange(this.value);
  }

  public updateValueAndStyle(): void {
    this.value = this.adapterService.getEditorInnerHtml(this.id);
    this._initialStyleState = {
      ...this._initialStyleState,
      ...this.adapterService.getStyleState(this.id) as any
    };
  }

  /* istanbul ignore next */
  public onTouch = () => {};

  /* istanbul ignore next */
  private _onChange = (_: string) => {};
}
