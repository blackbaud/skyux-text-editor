import {
  Component
} from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'icon-button-test',
  templateUrl: './icon-button.component.fixture.html'
})
export class IconButtonFixtureComponent {
  public label = 'Label';
  public icon = 'paste';
  public isActive = false;
}
