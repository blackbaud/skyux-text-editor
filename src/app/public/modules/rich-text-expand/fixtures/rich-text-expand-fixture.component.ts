import { Component } from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'rich-text-expand-fixture',
  templateUrl: './rich-text-expand-fixture.component.html'
})
export class RichTextExpandFixtureComponent {
  // tslint:disable-next-line
  public modalLengthRichText: string = '<font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u>Super styled text</u></i></b></font><div><font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u>Even more text</u></i></b></font></div><div><font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u>Another line<br></u></i></b></font>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line</div>';
  public richText: string = '<font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u>Super styled text</u></i></b></font><div><font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u>Even more text</u></i></b></font></div><div><font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u>Another line<br></u></i></b></font>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line</div>';

  public maxHeight = 100;
  public maxExpandedHeight = 400;
}
