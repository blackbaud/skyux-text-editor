import {
  Component
} from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'test-sky-tooltip',
  templateUrl: './tooltip.fixture.component.html'
})
export class TooltipFixtureComponent {
  public label: string = 'Best label';
}
