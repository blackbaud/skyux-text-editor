import {
  by,
  element,
  browser
} from 'protractor';

import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

describe('Rich text editor', () => {
  beforeEach(() => {
    SkyHostBrowser.get('visual/rich-text-editor');
    SkyHostBrowser.setWindowBreakpoint('lg');
  });

  it('should match basic screenshot', (done) => {
    expect('form').toMatchBaselineScreenshot(done, {
      screenshotName: 'rich-text-editor-basic'
    });
  });

  it('should match link modal screenshot', (done) => {
    element(by.css('.Link button')).click();
    SkyHostBrowser.moveCursorOffScreen();
    expect('body').toMatchBaselineScreenshot(done, {
      screenshotName: 'rich-text-editor-link-modal'
    });
  });

  it('should match merge field screenshot', (done) => {
    element(by.css('.MergeField .sky-dropdown-button')).click();
    element(by.css('.sky-dropdown-item button')).click();

    setTimeout(() => {
      expect('form').toMatchBaselineScreenshot(done, {
        screenshotName: 'rich-text-editor-merge-field'
      });
    }, 1000);
  });

  it('should match tooltip screenshot', (done) => {
    browser
      .actions()
      .mouseMove(element(by.css('.FontSize .sky-tooltip-container')))
      .perform();

    expect('form').toMatchBaselineScreenshot(done, {
      screenshotName: 'rich-text-editor-tooltip'
    });
  });
});
