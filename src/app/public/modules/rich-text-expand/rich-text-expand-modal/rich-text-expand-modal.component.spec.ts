import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyModalConfiguration, SkyModalHostService, SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyRichTextExpandModule } from '../rich-text-expand.module';
import { SkyRichTextExpandModalContext } from './rich-text-expand-modal-context';
import { SkyRichTextExpandModalComponent } from './rich-text-expand-modal.component';
import {
  expect
} from '@skyux-sdk/testing';

describe('Rich text expand', () => {
  let fixture: ComponentFixture<SkyRichTextExpandModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        SkyRichTextExpandModule,
        SkyModalModule
      ],
      providers: [
        SkyModalHostService,
        SkyModalConfiguration,
        { provide: SkyRichTextExpandModalContext, useValue: {
          header: 'header',
          displayValue: '<p>hello</p>'
        } },
        {
          provide: SkyModalInstance,
          useValue: { close: () => {} }
        }
      ]
    });

    fixture = TestBed.createComponent(SkyRichTextExpandModalComponent);
  });

  function detectChanges() {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  it('Should use default header if none is supplied', fakeAsync(() => {
    detectChanges();
    fixture.componentInstance.context.header = undefined;
    detectChanges();

    const header: HTMLElement = fixture.nativeElement.querySelector('sky-modal-header');
    expect(header.textContent).toContain('expand_modal_default_header');
  }));

  it('Should close when the close button is clicked', fakeAsync(() => {
    detectChanges();

    const header: HTMLElement = fixture.nativeElement.querySelector('sky-modal-header');
    expect(header.textContent).toContain('header');

    const modalInstance = TestBed.inject(SkyModalInstance);
    const closeSpy = spyOn(modalInstance, 'close').and.callThrough();
    fixture.nativeElement.querySelector('.sky-btn-link').click();

    detectChanges();
    expect(closeSpy).toHaveBeenCalled();
  }));
});
