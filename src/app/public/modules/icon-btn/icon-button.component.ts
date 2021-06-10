import {
  Component,
  Input
} from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'sky-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class SkyIconButtonComponent {
    @Input()
    public icon: string;

    @Input()
    public label: string;

    @Input()
    public isActive = false;

    @Input()
    public disabled = false;
}
