import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  SkyIconButtonModule
} from './icon-button.module';

import {
  IconButtonFixtureComponent
} from './fixtures/icon-button.component.fixture';

import {
  CommonModule
} from '@angular/common';

import {
  expect
} from '@skyux-sdk/testing';

describe('Icon button', () => {
  let fixture: ComponentFixture<IconButtonFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SkyIconButtonModule
      ],
      declarations: [
        IconButtonFixtureComponent
      ]
    });

    fixture = TestBed.createComponent(IconButtonFixtureComponent);
  });

  it('Shows correct icon', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fa-paste')).toBeTruthy();
  });

  it('uses active class when active', () => {
    fixture.componentInstance.isActive = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.icon-btn-active')).toBeTruthy();
  });

  it('does not use active class when not active', () => {
    fixture.componentInstance.isActive = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.icon-btn-active')).toBeFalsy();
  });

  it('Shows tooltip and sets aria-label for inputted label', () => {
    const expectedLabel = 'Some label';
    fixture.componentInstance.label = expectedLabel;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe(expectedLabel);
  });

  it('should use icon as label when no label is provided', () => {
    fixture.componentInstance.label = undefined;
    fixture.componentInstance.icon = 'paste';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('paste');
  });

  it('should be accessible', (done) => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
      done();
    });
  });
});
