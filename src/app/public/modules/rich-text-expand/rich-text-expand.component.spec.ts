import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyModalService } from '@skyux/modals';
import { RichTextExpandFixtureComponent } from './fixtures/rich-text-expand-fixture.component';
import { SkyRichTextExpandModalContext } from './rich-text-expand-modal/rich-text-expand-modal-context';
import { SkyRichTextExpandModalComponent } from './rich-text-expand-modal/rich-text-expand-modal.component';
import { SkyRichTextExpandModule } from './rich-text-expand.module';
import {
  expect
} from '@skyux-sdk/testing';
import {
  MockSkyModalService
} from '../../testing/mocks/sky-modal-service.mock';
import { DomSanitizer } from '@angular/platform-browser';

describe('Rich text expand', () => {
  let fixture: ComponentFixture<RichTextExpandFixtureComponent>;
  let mockModalService: MockSkyModalService;

  beforeEach(() => {
    mockModalService = new MockSkyModalService();

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        SkyRichTextExpandModule
      ],
      declarations: [
        RichTextExpandFixtureComponent
      ],
      providers: [
        { provide: SkyModalService, useValue: mockModalService }
      ]
    });

    fixture = TestBed.createComponent(RichTextExpandFixtureComponent);
  });

  function detectChanges() {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  it('Should expand inline when height is short enough', fakeAsync(() => {
    detectChanges();
    const modalSpy = spyOn(mockModalService, 'open').and.callThrough();
    fixture.nativeElement.querySelector('.sky-text-expand-see-more').click();

    detectChanges();
    expect(modalSpy).not.toHaveBeenCalled();
    const textDisplay: HTMLElement = fixture.nativeElement.querySelector('.sky-rich-text-expand-text');
    expect(textDisplay.style.maxHeight).toBe('100%');
  }));

  it('Should expand into modal when height is too much', fakeAsync(() => {
    fixture.componentInstance.richText = fixture.componentInstance.modalLengthRichText;
    detectChanges();
    const modalSpy = spyOn(mockModalService, 'open').and.callThrough();
    fixture.nativeElement.querySelector('.sky-text-expand-see-more').click();

    detectChanges();
    const sanitizer = TestBed.inject(DomSanitizer);
    expect(modalSpy).toHaveBeenCalledWith(
      SkyRichTextExpandModalComponent,
      [{
        provide: SkyRichTextExpandModalContext,
        useValue: {
          header: undefined,
          displayValue: sanitizer.bypassSecurityTrustHtml(fixture.componentInstance.richText)
        }
      }]
    );
    const textDisplay: HTMLElement = fixture.nativeElement.querySelector('.sky-rich-text-expand-text');
    expect(textDisplay.style.maxHeight).toBe('100px');
  }));
});
