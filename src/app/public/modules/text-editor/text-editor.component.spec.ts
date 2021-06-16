import {
  CommonModule
} from '@angular/common';

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  expect, expectAsync, SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  styleStateDefaults
} from './defaults/style-state-defaults';

import {
  TextEditorFixtureComponent
} from './fixtures/text-editor.component.fixture';

import {
  SkyTextEditorManagementService
} from './services/text-editor-management.service';

import {
  SkyuxRichTextEditorMenubarSection
} from './types/menubar-section';

import {
  SkyuxRichTextEditorStyleState
} from './types/style-state';

import {
  SkyuxRichTextEditorToolbarSection
} from './types/toolbar-section';

import {
  SkyTextEditorModule
} from './text-editor.module';

describe('Rich text editor', () => {
  let fixture: ComponentFixture<TextEditorFixtureComponent>;

  function checkboxExecCommandTest(checkboxInputElement: HTMLElement, expectedCommand: string) {
    let execCommandCalled = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const innerDocument = fixture.nativeElement.querySelector('iframe').contentDocument;
    innerDocument.execCommand = (command: string, _: boolean, value: string) => {
      execCommandCalled = true;
      expect(command).toBe(expectedCommand);
    };

    checkboxInputElement.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(execCommandCalled).toBeTruthy();
  }

  function buttonExecCommandTest(buttonElement: HTMLButtonElement, expectedCommand: string, expectedValue: string = '') {
    let execCommandCalled = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const innerDocument = fixture.nativeElement.querySelector('iframe').contentDocument;
    innerDocument.execCommand = (command: string, _: boolean, value: string) => {
      execCommandCalled = true;
      expect(command).toBe(expectedCommand);
      expect(value).toBe(expectedValue);
    };

    SkyAppTestUtility.fireDomEvent(buttonElement, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(execCommandCalled).toBeTruthy();
  }

  function openDropdown(className: string) {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const dropdown: HTMLElement = fixture.nativeElement.querySelector(`.${className}`);
    expect(dropdown).toBeTruthy();
    const dropdownButton: HTMLButtonElement = dropdown.querySelector('.sky-dropdown-button');
    expect(dropdownButton).toBeTruthy();
    SkyAppTestUtility.fireDomEvent(dropdownButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  function dropdownButtonExecCommandTest(
    dropdownElementClassName: string,
    optionIndex: number,
    expectedCommand: string,
    expectedValue: string = ''
  ) {
    let execCommandCalled = false;
    const commandsCalled: string[] = [];
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const innerDocument = fixture.nativeElement.querySelector('iframe').contentDocument;
    innerDocument.execCommand = (command: string, _: boolean, value: string) => {
      execCommandCalled = true;
      expect(value).toBe(expectedValue);
      commandsCalled.push(command);
    };

    openDropdown(dropdownElementClassName);

    const optionButtons = document.querySelectorAll('.menu-dropdown-item');
    SkyAppTestUtility.fireDomEvent(optionButtons[optionIndex], 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(execCommandCalled).toBeTruthy();
    expect(commandsCalled.filter(command => command === expectedCommand).length > 0).toBeTruthy();
  }

  function collapseSelection(toStart = true): void {
    const iframe = fixture.nativeElement.querySelector('iframe');
    const windowEl = iframe.contentWindow;
    const sel: Selection = windowEl.getSelection();
    if (toStart) {
      sel.collapseToStart();
    } else {
      sel.collapseToEnd();
    }

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  function selectContent(selector = ''): void {
    const iframe = fixture.nativeElement.querySelector('iframe');
    const documentEl = iframe.contentDocument;
    const windowEl = iframe.contentWindow;
    const elementToSelect = !selector ? documentEl.body : documentEl.body.querySelector(selector);
    elementToSelect.focus();
    const range = documentEl.createRange();
    range.selectNodeContents(elementToSelect);
    const sel = windowEl.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        SkyDropdownModule,
        SkyTextEditorModule
      ],
      declarations: [
        TextEditorFixtureComponent
      ],
      providers: [
        SkyThemeService
      ]
    });

    fixture = TestBed.createComponent(TextEditorFixtureComponent);
  });

  it('Shows correct toolbar content', () => {
    fixture.componentInstance.menubarSections = [
      SkyuxRichTextEditorMenubarSection.Edit,
      SkyuxRichTextEditorMenubarSection.MergeField,
      SkyuxRichTextEditorMenubarSection.Format
    ];
    fixture.componentInstance.toolbarSections = [
      SkyuxRichTextEditorToolbarSection.Alignment,
      SkyuxRichTextEditorToolbarSection.Color,
      SkyuxRichTextEditorToolbarSection.FontFamily,
      SkyuxRichTextEditorToolbarSection.FontSize,
      SkyuxRichTextEditorToolbarSection.FontStyle,
      SkyuxRichTextEditorToolbarSection.Indentation,
      SkyuxRichTextEditorToolbarSection.Link,
      SkyuxRichTextEditorToolbarSection.List,
      SkyuxRichTextEditorToolbarSection.UndoRedo
    ];

    fixture.detectChanges();
    const sections = fixture.nativeElement.querySelectorAll('.toolbar-section');
    expect(sections.length).toBe(9);
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.contains(SkyuxRichTextEditorToolbarSection[i]);
    }

    const menuSections = fixture.nativeElement.querySelectorAll('.menubar-section');
    expect(menuSections.length).toBe(3);
    for (let i = 0; i < menuSections.length; i++) {
      menuSections[i].classList.contains(SkyuxRichTextEditorMenubarSection[i]);
    }
  });

  it('Should return blank documents for non-existant documents', () => {
    const mngService = TestBed.inject(SkyTextEditorManagementService);
    expect(mngService.getEditorInnerHtml('fake-id')).toBe('');
  });

  it('should apply the placeholder', () => {
    const expectedPlaceholder = 'Please enter some text';
    fixture.componentInstance.placeholder = expectedPlaceholder;
    fixture.detectChanges();

    let iframe: HTMLIFrameElement = fixture.nativeElement.querySelector('iframe');
    let placeholder = iframe.contentDocument.body.getAttribute('data-placeholder');
    expect(placeholder).toBe(expectedPlaceholder);

    const expectedPlaceholder2 = 'Some other placeholder text';
    fixture.componentInstance.placeholder = expectedPlaceholder2;
    fixture.detectChanges();

    iframe = fixture.nativeElement.querySelector('iframe');
    placeholder = iframe.contentDocument.body.getAttribute('data-placeholder');
    expect(placeholder).toBe(expectedPlaceholder2);
  });

  it('Shows correct font size list', () => {
    fixture.componentInstance.fontSizeList = [
      3,
      10,
      16,
      20
    ];

    fixture.detectChanges();
    const sizes = fixture.nativeElement.querySelectorAll('.FontSize option');
    expect(sizes.length).toBe(4);
    for (let i = 0; i < sizes.length; i++) {
      expect(sizes[i].value).toBe(fixture.componentInstance.fontSizeList[i].toString());
    }
  });

  it('Shows correct font list', () => {
    fixture.componentInstance.fontList = [
      {
        name: 'Blackbaud Sans',
        value: '"Blackbaud Sans", "Helvetica Neue", Arial, sans-serif'
      },
      {
        name: 'Arial',
        value: 'Arial'
      },
      {
        name: 'Arial Black',
        value: '"Arial Black"'
      }
    ];

    fixture.detectChanges();

    const fonts = fixture.nativeElement.querySelectorAll('.FontFamily option');
    expect(fonts.length).toBe(3);
    for (let i = 0; i < fonts.length; i++) {
      expect(fonts[i]).toHaveText(fixture.componentInstance.fontList[i].name);
      expect(fonts[i].value).toBe(fixture.componentInstance.fontList[i].value);
    }
  });

  // Autofocus does not work in Firefox and IE
/*   it('should respect autofocus', () => {
    fixture.componentInstance.autofocus = true;
    fixture.detectChanges();
    const iframe = fixture.nativeElement.querySelector('iframe');

    expect(document.activeElement).toBe(iframe);
    expect(iframe.contentDocument.activeElement).toBe(iframe.contentDocument.body);
  }); */

  it('should close dropdowns when editor is clicked', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    openDropdown('MergeField');
    expect(document.querySelector('.sky-dropdown-item')).toBeTruthy();

    const iframe: HTMLIFrameElement = fixture.nativeElement.querySelector('iframe');
    SkyAppTestUtility.fireDomEvent(iframe.contentDocument, 'mousedown');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(document.querySelector('.sky-dropdown-item')).toBeFalsy();
  }));

  it('should respect passed in merge fields', fakeAsync(() => {
    // Setup in fixture
    fixture.detectChanges();
    openDropdown('MergeField');

    const mergeFieldOptions = document.querySelectorAll('.sky-dropdown-item');
    expect(mergeFieldOptions.length).toBe(3);
    expect(mergeFieldOptions[0].innerHTML).toContain('Best field');
    expect(mergeFieldOptions[1].innerHTML).toContain('Second best field');
    expect(mergeFieldOptions[2].innerHTML).toContain('A field that is really too long for its own good');
  }));

  it('should insert img with proper data tags for merge field commands', fakeAsync(() => {
    // Setup in fixture
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    openDropdown('MergeField');
    const optionButtons = document.querySelectorAll('.sky-dropdown-item button');
    expect(optionButtons.length).toBe(3);
    SkyAppTestUtility.fireDomEvent(optionButtons[0], 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toContain('data-fieldid="0"');
    expect(fixture.componentInstance.value).toContain('data-fielddisplay="Best field"');
  }));

  it('should use preview img for merge field commands if supplied', fakeAsync(() => {
    // Setup in fixture
    const imageUrl = 'https://unavailable.blackbaud.com/images/blackbaud.png';
    fixture.componentInstance.mergeFields[0].previewImageUrl = imageUrl;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    openDropdown('MergeField');
    expect(document.querySelector('.sky-dropdown-item')).toBeTruthy();

    const mergeFieldOption = document.querySelector('.sky-dropdown-item button');
    SkyAppTestUtility.fireDomEvent(mergeFieldOption, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toContain('src="' + imageUrl + '"');
  }));

  it('should truncate oversized labels of merge field commands', fakeAsync(() => {
    // Setup in fixture
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    openDropdown('MergeField');
    expect(document.querySelector('.sky-dropdown-item')).toBeTruthy();

    const mergeFieldOption = document.querySelectorAll('.sky-dropdown-item button')[2];
    SkyAppTestUtility.fireDomEvent(mergeFieldOption, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toContain('data-fieldid="2"');
    expect(fixture.componentInstance.value).toContain('data-fielddisplay="A field that is really too long for its own good"');
  }));

  it('Toolbar values should update based on selection', fakeAsync(() => {
    fixture.componentInstance.value =
    '<font style="font-size: 16px" face="Arial" color="#c14040">' +
      '<b>' +
        '<i>' +
          '<u>' +
            'Super styled text' +
          '</u>' +
        '</i>' +
      '</b>' +
    '</font>';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    selectContent('u');

    const iframe = fixture.nativeElement.querySelector('iframe');
    SkyAppTestUtility.fireDomEvent(iframe.contentDocument, 'selectionchange');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const toolbar = fixture.nativeElement.querySelector('.toolbar');
    expect(toolbar.querySelector('.FontFamily select').value).toBe('Arial');
    expect(toolbar.querySelector('.FontSize select').value).toBe('16');
    expect(toolbar.querySelector('.font-color-picker').value).toBe('#c14040');
    expect(toolbar.querySelector('.FontStyle').querySelectorAll('.sky-switch-input:checked').length).toBe(3);

    // Firefox backcolor bug: https://bugzilla.mozilla.org/show_bug.cgi?id=547848
    // expect(toolbar.querySelector('.background-color-picker').value).toBe('#51b6ca');
  }));

  it('should set font family', fakeAsync(() => {
    const expectedCommand = 'fontname';
    const expectedValue = 'Arial';
    let execCommandCalled = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const innerDocument = fixture.nativeElement.querySelector('iframe').contentDocument;
    innerDocument.execCommand = (command: string, _: boolean, value: string) => {
      execCommandCalled = true;
      expect(command).toBe(expectedCommand);
      expect(value).toBe(expectedValue);
    };

    const selectField: HTMLInputElement = fixture.nativeElement.querySelector('.FontFamily select');
    selectField.value = expectedValue;
    SkyAppTestUtility.fireDomEvent(selectField, 'change');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(execCommandCalled).toBeTruthy();
  }));

  it('should set font size', fakeAsync(() => {
    const expectedCommand = 'fontSize';
    const expectedValue = 1;
    let execCommandCalled = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const innerDocument = fixture.nativeElement.querySelector('iframe').contentDocument;
    innerDocument.execCommand = (command: string, _: boolean, value: any) => {
      execCommandCalled = true;
      expect(command).toBe(expectedCommand);
      expect(value).toBe(expectedValue);
    };

    const selectField: HTMLInputElement = fixture.nativeElement.querySelector('.FontSize select');
    selectField.value = '14';
    SkyAppTestUtility.fireDomEvent(selectField, 'change');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(execCommandCalled).toBeTruthy();
  }));

  it('should not leave stale elements when setting font size', fakeAsync(() => {
    fixture.componentInstance.value = '<font style="font-size: 26px;"><span>Super</span> styled text</font>';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const selectField: HTMLInputElement = fixture.nativeElement.querySelector('.FontSize select');
    selectContent('span');
    selectField.value = '14';
    SkyAppTestUtility.fireDomEvent(selectField, 'change');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect([
      '<font style="font-size: 14px;">Super</font><span style="font-size: 26px;"> styled text</span>', // Normal
      '<font style="font-size: 14px;">Super</font><font style="font-size: 26px;"> styled text</font>', // Edge
      '<font style="font-size: 26px;"><font style="font-size: 14px;">Super</font> styled text</font>' // IE11
    ]).toContain(
      fixture.componentInstance.value
    );
  }));

  it('should set font color', fakeAsync(() => {
    const expectedCommand = 'foreColor';
    const expectedValue = '#ba4949';
    let execCommandCalled = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const innerDocument = fixture.nativeElement.querySelector('iframe').contentDocument;
    innerDocument.execCommand = (command: string, _: boolean, value: string) => {
      execCommandCalled = true;
      expect(command).toBe(expectedCommand);
      expect(value).toBe(expectedValue);
    };

    const colorField: HTMLInputElement = fixture.nativeElement.querySelectorAll('sky-colorpicker')[0];
    SkyAppTestUtility.fireDomEvent(colorField, 'selectedColorChanged', {
      customEventInit: {
        hex: '#ba4949'
      }
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(execCommandCalled).toBeTruthy();
  }));

  it('should set background color', fakeAsync(() => {
    const expectedCommand = 'backColor';
    const expectedValue = '#ba4949';
    let execCommandCalled = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const innerDocument = fixture.nativeElement.querySelector('iframe').contentDocument;
    innerDocument.execCommand = (command: string, _: boolean, value: string) => {
      execCommandCalled = true;
      expect(command).toBe(expectedCommand);
      expect(value).toBe(expectedValue);
    };

    const colorField: HTMLInputElement = fixture.nativeElement.querySelectorAll('sky-colorpicker')[1];
    SkyAppTestUtility.fireDomEvent(colorField, 'selectedColorChanged', {
      customEventInit: {
        hex: '#ba4949'
      }
    });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(execCommandCalled).toBeTruthy();
  }));

  it('should set bulleted list', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'insertUnorderedList';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.List button')[0];
    buttonExecCommandTest(button, expectedCommand);
  }));

  it('should set ordered list', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'insertOrderedList';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.List button')[1];
    buttonExecCommandTest(button, expectedCommand);
  }));

  it('should set underline', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'underline';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.FontStyle sky-checkbox input')[2];
    checkboxExecCommandTest(button, expectedCommand);
  }));

  it('should set italicized', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'italic';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.FontStyle sky-checkbox input')[1];
    checkboxExecCommandTest(button, expectedCommand);
  }));

  it('should set bold', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'bold';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.FontStyle sky-checkbox input')[0];
    checkboxExecCommandTest(button, expectedCommand);
  }));

  it('should set align left', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'justifyLeft';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.Alignment button')[0];
    buttonExecCommandTest(button, expectedCommand);
  }));

  it('should set align center', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'justifyCenter';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.Alignment button')[1];
    buttonExecCommandTest(button, expectedCommand);
  }));

  it('should set align right', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'justifyRight';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.Alignment button')[2];
    buttonExecCommandTest(button, expectedCommand);
  }));

  it('should set outdented', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'outdent';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.Indentation button')[0];
    buttonExecCommandTest(button, expectedCommand);
  }));

  it('should set indented', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'indent';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.Indentation button')[1];
    buttonExecCommandTest(button, expectedCommand);
  }));

  it('should execute undo', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'undo';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.UndoRedo button')[0];
    buttonExecCommandTest(button, expectedCommand);
  }));

  it('should execute redo', fakeAsync(() => {
    fixture.detectChanges();
    const expectedCommand = 'redo';
    const button: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.UndoRedo button')[1];
    buttonExecCommandTest(button, expectedCommand);
  }));

  it('should create a link targetting the same window', fakeAsync(() => {
    fixture.componentInstance.value = '<p>Click here</p>';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    selectContent();

    const linkButton = fixture.nativeElement.querySelector('.Link button');
    SkyAppTestUtility.fireDomEvent(linkButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const urlField: HTMLInputElement = document.querySelector('.sky-modal input');
    urlField.value = 'https://google.com';
    SkyAppTestUtility.fireDomEvent(urlField, 'input');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const saveButton = document.querySelector('.sky-modal-footer-container .sky-btn-primary');
    SkyAppTestUtility.fireDomEvent(saveButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(document.querySelector('.sky-modal')).toBeFalsy();
    expect(fixture.componentInstance.value).toContain('<a href="https://google.com">');
  }));

  it('should create a link targetting a new window', fakeAsync(() => {
    fixture.componentInstance.value = '<p>Click here</p>';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    selectContent();

    const linkButton = fixture.nativeElement.querySelector('.Link button');
    SkyAppTestUtility.fireDomEvent(linkButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const urlField: HTMLInputElement = document.querySelector('.sky-modal input');
    urlField.value = 'https://google.com';
    SkyAppTestUtility.fireDomEvent(urlField, 'input');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const selectField: HTMLInputElement = document.querySelector('.sky-modal select');
    selectField.value = '1';
    SkyAppTestUtility.fireDomEvent(selectField, 'change');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const saveButton: HTMLElement = document.querySelector('.sky-modal-footer-container .sky-btn-primary');
    saveButton.click();
    SkyAppTestUtility.fireDomEvent(saveButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(document.querySelector('.sky-modal')).toBeFalsy();
    expect(fixture.componentInstance.value).toContain('href="https://google.com');
    expect(fixture.componentInstance.value).toContain('rel="noopener noreferrer"');
    expect(fixture.componentInstance.value).toContain('target="_blank"');
  }));

  it('should create an email address link', fakeAsync(() => {
    fixture.componentInstance.value = '<p>Click here</p>';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    selectContent('p');

    const linkButton = fixture.nativeElement.querySelector('.Link button');
    SkyAppTestUtility.fireDomEvent(linkButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const emailTab = document.querySelectorAll('.sky-btn-tab')[1] as HTMLAnchorElement;
    emailTab.href = '#';
    SkyAppTestUtility.fireDomEvent(emailTab, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const inputFields = document.querySelectorAll('.sky-modal input');
    const emailField: HTMLInputElement = inputFields[1] as HTMLInputElement;
    emailField.value = 'harima.kenji@schooldays.asia';
    SkyAppTestUtility.fireDomEvent(emailField, 'input');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const saveButton: HTMLButtonElement = document.querySelector('.sky-modal-footer-container .sky-btn-primary');
    saveButton.click();
    SkyAppTestUtility.fireDomEvent(saveButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(document.querySelector('.sky-modal')).toBeFalsy();
    expect(fixture.componentInstance.value).toContain('<a href="mailto:harima.kenji@schooldays.asia">');
  }));

  it('should create an email address link with subject', fakeAsync(() => {
    fixture.componentInstance.value = '<p>Click here</p>';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    selectContent('p');

    const linkButton = fixture.nativeElement.querySelector('.Link button');
    SkyAppTestUtility.fireDomEvent(linkButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const emailTab = document.querySelectorAll('.sky-btn-tab')[1] as HTMLAnchorElement;
    emailTab.href = '#';
    SkyAppTestUtility.fireDomEvent(emailTab, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const inputFields = document.querySelectorAll('.sky-modal input');
    const emailField: HTMLInputElement = inputFields[1] as HTMLInputElement;
    emailField.value = 'harima.kenji@schooldays.asia';
    SkyAppTestUtility.fireDomEvent(emailField, 'input');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const subjectField: HTMLInputElement = inputFields[2] as HTMLInputElement;
    subjectField.value = 'none really';
    SkyAppTestUtility.fireDomEvent(subjectField, 'input');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const saveButton: HTMLButtonElement = document.querySelector('.sky-modal-footer-container .sky-btn-primary');
    saveButton.click();
    SkyAppTestUtility.fireDomEvent(saveButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(document.querySelector('.sky-modal')).toBeFalsy();
    expect(fixture.componentInstance.value).toContain('<a href="mailto:harima.kenji@schooldays.asia?Subject=none%20really">');
  }));

  it('should be able to update an existing link', fakeAsync(() => {
    fixture.componentInstance.value = '<a href="https://google.com">Click here</p>';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    selectContent('a');

    const linkButton = fixture.nativeElement.querySelector('.Link button');
    SkyAppTestUtility.fireDomEvent(linkButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const urlField: HTMLInputElement = document.querySelector('.sky-modal input');
    urlField.value = 'https://uncyclopedia.org';
    SkyAppTestUtility.fireDomEvent(urlField, 'input');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const saveButton = document.querySelector('.sky-modal-footer-container .sky-btn-primary');
    SkyAppTestUtility.fireDomEvent(saveButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(document.querySelector('.sky-modal')).toBeFalsy();
    expect(fixture.componentInstance.value).toContain('<a href="https://uncyclopedia.org">');
  }));

  it('should load in selected link data', fakeAsync(() => {
    fixture.componentInstance.value = '<a href="https://google.com">Click here</a>';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    selectContent('a');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const linkButton = fixture.nativeElement.querySelector('.Link button');
    SkyAppTestUtility.fireDomEvent(linkButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const urlField: HTMLInputElement = document.querySelector('.sky-modal input');
    const selectField: HTMLInputElement = document.querySelector('.sky-modal select');
    expect(document.querySelector('.sky-modal')).toBeTruthy();
    expect(urlField.value).toBe('https://google.com/');
    expect(selectField.value).toBe('0');

    const cancelButton = document.querySelector('.sky-modal-footer-container .sky-btn-link');
    SkyAppTestUtility.fireDomEvent(cancelButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(document.querySelector('.sky-modal')).toBeFalsy();
  }));

  it('should load in selected email link data', fakeAsync(() => {
    fixture.componentInstance.value = '<a href="mailto:nero.claudius@pharoah-emperors.gov?Subject=Padoru%20Padoru">Click here</a>';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    selectContent('a');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const linkButton = fixture.nativeElement.querySelector('.Link button');
    SkyAppTestUtility.fireDomEvent(linkButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.sky-modal input');
    expect(document.querySelector('.sky-modal')).toBeTruthy();
    expect(inputs[1].value).toBe('nero.claudius@pharoah-emperors.gov');
    expect(inputs[2].value).toBe('Padoru Padoru');

    const cancelButton = document.querySelector('.sky-modal-footer-container .sky-btn-link');
    SkyAppTestUtility.fireDomEvent(cancelButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(document.querySelector('.sky-modal')).toBeFalsy();
  }));

  it('should disable unlink button when non-link selection is made', fakeAsync(() => {
    fixture.componentInstance.value = '<div><p>gary is awesome</p><a href="https://google.com">Click here</a></div>';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    selectContent('p');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const linkButton = fixture.nativeElement.querySelectorAll('.Link button')[1];
    SkyAppTestUtility.fireDomEvent(linkButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(document.querySelectorAll('.Link button')[1].getAttribute('disabled')).not.toBe(undefined);
  }));

  it('should unlink active link element', fakeAsync(() => {
    fixture.componentInstance.value = '<a href="https://google.com">Click here</a>';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    selectContent('a');
    collapseSelection();

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const unlinkButton = fixture.nativeElement.querySelectorAll('.Link button')[1];
    SkyAppTestUtility.fireDomEvent(unlinkButton, 'click');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('a')).toBeFalsy();
  }));

  it('should set the style of the iframe body to the default style if a style state is not provided', fakeAsync(() => {
    fixture.detectChanges();

    let style: CSSStyleDeclaration = fixture.nativeElement.querySelector('iframe').contentDocument.querySelector('body').style;
    expect(style.getPropertyValue('background-color')).toEqual('rgba(0, 0, 0, 0)');
    expect(style.getPropertyValue('color')).toEqual('rgb(0, 0, 0)');
    expect(style.getPropertyValue('font-family')).toEqual(styleStateDefaults.font);
    expect(style.getPropertyValue('font-size')).toEqual(`${styleStateDefaults.fontSize}px`);
  }));

  it('should set the style of the iframe body to the provided style state', fakeAsync(() => {
    const backColor: string = '#333333'; // rgb(51, 51, 51)
    const fontColor: string = '#EEEEEE'; // rgb(238, 238, 238)
    const font: string = 'Times New Roman';
    const fontSize: number = 22;

    fixture.componentInstance.styleState = {
      backColor: backColor,
      fontColor: fontColor,
      font: font,
      fontSize: fontSize
    } as SkyuxRichTextEditorStyleState;
    fixture.detectChanges();

    let style: CSSStyleDeclaration = fixture.nativeElement.querySelector('iframe').contentDocument.querySelector('body').style;
    expect(style.getPropertyValue('background-color')).toEqual('rgb(51, 51, 51)');
    expect(style.getPropertyValue('color')).toEqual('rgb(238, 238, 238)');
    expect(style.getPropertyValue('font-family')).toEqual(`"${font}"`);
    expect(style.getPropertyValue('font-size')).toEqual(`${fontSize}px`);
  }));

  describe('Menubar commands', () => {
    it('should execute undo', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'undo';
      const optionNumber = 0;
      dropdownButtonExecCommandTest('Edit', optionNumber, expectedCommand);
    }));

    it('should execute redo', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'redo';
      const optionNumber = 1;
      dropdownButtonExecCommandTest('Edit', optionNumber, expectedCommand);
    }));

    it('should execute cut', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'cut';
      const optionNumber = 2;
      dropdownButtonExecCommandTest('Edit', optionNumber, expectedCommand);
    }));

    it('should execute copy', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'copy';
      const optionNumber = 3;
      dropdownButtonExecCommandTest('Edit', optionNumber, expectedCommand);
    }));

    it('should execute paste', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'paste';
      const optionNumber = 4;
      dropdownButtonExecCommandTest('Edit', optionNumber, expectedCommand);
    }));

    it('should execute select all', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'selectAll';
      const optionNumber = 5;
      dropdownButtonExecCommandTest('Edit', optionNumber, expectedCommand);
    }));

    it('should execute bold', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'bold';
      const optionNumber = 0;
      dropdownButtonExecCommandTest('Format', optionNumber, expectedCommand);
    }));

    it('should execute italic', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'italic';
      const optionNumber = 1;
      dropdownButtonExecCommandTest('Format', optionNumber, expectedCommand);
    }));

    it('should execute underline', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'underline';
      const optionNumber = 2;
      dropdownButtonExecCommandTest('Format', optionNumber, expectedCommand);
    }));

    it('should execute strikethrough', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'strikethrough';
      const optionNumber = 3;
      dropdownButtonExecCommandTest('Format', optionNumber, expectedCommand);
    }));

    it('should execute clear formatting', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCommand = 'removeFormat';
      const optionNumber = 4;
      dropdownButtonExecCommandTest('Format', optionNumber, expectedCommand);
    }));

    it('should execute select all and clear formatting when nothing is highlighted', fakeAsync(() => {
      fixture.componentInstance.value = '<p>some kinda stuff</p>';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const commandsCalled: string[] = [];
      const optionIndex = 4;

      let execCommandCalled = false;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const innerDocument = fixture.nativeElement.querySelector('iframe').contentDocument;
      innerDocument.execCommand = (command: string, _: boolean, __: string) => {
        execCommandCalled = true;
        commandsCalled.push(command);
      };

      openDropdown('Format');
      selectContent('p');
      collapseSelection();

      const optionButtons = document.querySelectorAll('.menu-dropdown-item');
      SkyAppTestUtility.fireDomEvent(optionButtons[optionIndex], 'click');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(execCommandCalled).toBeTruthy();
      expect(commandsCalled.length).toBe(2);
      expect(commandsCalled[0]).toBe('selectAll');
      expect(commandsCalled[1]).toBe('removeFormat');
    }));
  });

  it('should pass accessibility', async () => {
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
