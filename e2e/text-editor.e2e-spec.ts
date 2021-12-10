import {
  SkyHostBrowserBreakpoint
} from '@skyux-sdk/e2e/host-browser/host-browser-breakpoint';

import {
  expect,
  SkyHostBrowser,
  SkyVisualThemeSelector
} from '@skyux-sdk/e2e';

import {
  browser,
  by,
  element,
  ExpectedConditions
} from 'protractor';

describe('Text editor', () => {
  let browserSize: SkyHostBrowserBreakpoint;
  let currentTheme: string;
  let currentThemeMode: string;

  async function selectTheme(theme: string, mode: string): Promise<void> {
    currentTheme = theme;
    currentThemeMode = mode;

    return SkyVisualThemeSelector.selectTheme(theme, mode);
  }

  async function setBrowserSize(size: SkyHostBrowserBreakpoint): Promise<void> {
    browserSize = size;

    return SkyHostBrowser.setWindowBreakpoint(size);
  }

  function getScreenshotName(name: string): string {
    if (browserSize) {
      name += '-' + browserSize;
    }

    if (currentTheme) {
      name += '-' + currentTheme;
    }

    if (currentThemeMode) {
      name += '-' + currentThemeMode;
    }

    return name;
  }

  async function validateTextEditorDisabled(done: DoneFn): Promise<void> {
    await element(by.css('#sky-btn-toggle-text-editor-ability')).click();
    expect('#screenshot-text-editor').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName('text-editor-disabled')
    });
  }

  function runTests(): void {
    it('should match screenshot', async (done) => {
      await SkyHostBrowser.moveCursorOffScreen();
      expect('#screenshot-text-editor').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('text-editor')
      });
    });

    it('should match link modal screenshot', async (done) => {
      await element.all(by.css('.sky-text-editor-toolbar-action-link button')).first().click();
      await SkyHostBrowser.moveCursorOffScreen();
      expect('.sky-modal').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('text-editor-link-modal')
      });
    });

    it('should match merge field screenshot', async (done) => {
      await element(by.css(
        '.sky-text-editor-menu-merge-field .sky-dropdown-button'
      )).click();
      await element(by.css('.sky-dropdown-item button')).click();
      await SkyHostBrowser.moveCursorOffScreen();

      await browser.wait(
        ExpectedConditions.elementToBeClickable(
          element(by.css('#screenshot-text-editor .sky-text-editor-wrapper'))
        ),
        5000
      );

      await SkyHostBrowser.scrollTo('#screenshot-text-editor');

      expect('#screenshot-text-editor .sky-text-editor-wrapper').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('text-editor-merge-field')
      });
    });

    it('should match previous disabled screenshot', (done) => {
      validateTextEditorDisabled(done);
    });
  }

  describe('(size: lg)', () => {
    beforeEach( async() => {
      currentTheme = undefined;
      currentThemeMode = undefined;
      await SkyHostBrowser.get('visual/text-editor');
      await setBrowserSize('lg');
    });

    runTests();

    describe('when modern theme', () => {
      beforeEach(async () => {
        await selectTheme('modern', 'light');
      });

      runTests();
    });

    describe('when modern theme in dark mode', () => {
      beforeEach(async () => {
        await selectTheme('modern', 'dark');
      });

      runTests();
    });
  });

  describe('(size: xs)', () => {
    beforeEach( async() => {
      currentTheme = undefined;
      currentThemeMode = undefined;
      await SkyHostBrowser.get('visual/text-editor');
      await setBrowserSize('xs');
    });

    runTests();

    describe('when modern theme', () => {
      beforeEach(async () => {
        await selectTheme('modern', 'light');
      });

      runTests();
    });

    describe('when modern theme in dark mode', () => {
      beforeEach(async () => {
        await selectTheme('modern', 'dark');
      });

      runTests();
    });
  });

});
