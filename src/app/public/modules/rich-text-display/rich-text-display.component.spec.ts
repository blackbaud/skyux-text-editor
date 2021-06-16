import {
  CommonModule
} from '@angular/common';

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  RichTextDisplayFixtureComponent
} from './fixtures/rich-text-display-fixture.component';

import {
  SkyRichTextDisplayModule
} from './rich-text-display.module';

describe('Rich text display', () => {
  let fixture: ComponentFixture<RichTextDisplayFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        SkyRichTextDisplayModule
      ],
      declarations: [
        RichTextDisplayFixtureComponent
      ]
    });

    fixture = TestBed.createComponent(RichTextDisplayFixtureComponent);
  });

  function detectChanges() {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  it('Should display inline', fakeAsync(() => {
    detectChanges();
    const textDisplay: HTMLElement = fixture.nativeElement.querySelector('.sky-rich-text-display-text');
    expect(textDisplay.textContent).toBe('Super styled text');
  }));
});
