import { Component } from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'rich-text-expand-demo',
  templateUrl: './rich-text-expand-visual.component.html'
})
export class TextExpandVisualComponent {
  // tslint:disable-next-line
  public richText: string = '<font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u>Super styled text</u></i></b></font><div><font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u>Even more text</u></i></b></font></div><div><font style="font-size: 16px" face="Arial" color="#a25353"><b><i><u>Another line<br></u></i></b></font>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line<br>Another line</div>';
}
