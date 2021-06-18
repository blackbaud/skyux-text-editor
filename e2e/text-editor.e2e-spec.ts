import {
  SkyHostBrowserBreakpoint
} from '@skyux-sdk/e2e/host-browser/host-browser-breakpoint';

import {
  expect,
  SkyHostBrowser,
  SkyVisualThemeSelector
} from '@skyux-sdk/e2e';

import {
  by,
  element
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

  function runTests(): void {
    it('should match screenshot', (done) => {
      expect('#screenshot-text-editor').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('text-editor')
      });
    });

    it('should match link modal screenshot', async (done) => {
      await element.all(by.css('.sky-text-editor-toolbar-action-Link button')).first().click();
      await SkyHostBrowser.moveCursorOffScreen();
      expect('body').toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('text-editor-link-modal')
      });
    });

    it('should match merge field screenshot', async (done) => {
      await element(by.css(
        '.sky-text-editor-menubar-action-MergeField .sky-dropdown-button'
      )).click();
      await element(by.css('.sky-dropdown-item button')).click();
      await SkyHostBrowser.moveCursorOffScreen();
      setTimeout(() => {
        expect('#screenshot-text-editor').toMatchBaselineScreenshot(done, {
          screenshotName: getScreenshotName('text-editor-merge-field')
        });
      }, 1000);
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
