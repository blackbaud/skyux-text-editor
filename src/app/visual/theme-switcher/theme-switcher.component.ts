import { Component, OnInit } from '@angular/core';

import { SkyAppConfig, SkyuxConfigAppSupportedTheme } from '@skyux/config';
import { SkyTheme, SkyThemeMode, SkyThemeService, SkyThemeSettings } from '@skyux/theme';

/**
 * @internal
 */
@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html'
})
export class ThemeSwitcherComponent implements OnInit {
  public themeName: SkyuxConfigAppSupportedTheme;

  constructor(
    private readonly themeSvc: SkyThemeService,
    private readonly config: SkyAppConfig
  ) { }

  public ngOnInit() {
    this.themeName = this.config.skyux.app?.theming?.theme;
  }

  public updateTheme() {
    const theme = this.themeName === 'default'
      ? SkyTheme.presets.default
      : SkyTheme.presets.modern;

    this.themeSvc.setTheme(new SkyThemeSettings(theme, SkyThemeMode.presets.light));
  }
}
