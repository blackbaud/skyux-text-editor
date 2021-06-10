import { Component } from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'rich-text-display-fixture',
  templateUrl: './rich-text-display-fixture.component.html'
})
export class RichTextDisplayFixtureComponent {
  // tslint:disable-next-line
  public richText = "<font style=\"font-size: 16px\" color=\"#a25353\"><b><i><u>Super styled text</u></i></b></font>"
}
