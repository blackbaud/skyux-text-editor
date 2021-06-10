import {
  Input,
  Component
} from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'sky-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class SkyTooltipComponent {
  @Input()
  public label: string;

  @Input()
  public disabled: boolean = false;
}
