import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyIconButtonComponent
} from './icon-button.component';

import {
  SkyTooltipModule
} from '../tooltip/tooltip.module';

@NgModule({
  imports: [
    CommonModule,
    SkyIconModule,
    SkyTooltipModule
  ],
  exports: [
    SkyIconButtonComponent
  ],
  declarations: [
    SkyIconButtonComponent
  ]
})
export class SkyIconButtonModule { }
