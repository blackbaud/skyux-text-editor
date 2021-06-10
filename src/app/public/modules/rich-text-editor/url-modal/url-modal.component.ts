import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkyValidation
} from '@skyux/validation';

import {
  UrlModalResult
} from './url-modal-result';

import {
  SkyUrlModalContext
} from './url-modal-context';

import {
  UrlTarget
} from './url-target';

const emailKey = 'mailto:';
const queryStringParamKey = '?Subject=';

/**
 * @internal
 */
@Component({
  selector: 'skyux-rich-text-editor-url-modal',
  templateUrl: './url-modal.component.html',
  styleUrls: ['./url-modal.component.scss']
})
export class SkyRichTextEditorUrlModalComponent {

    public set url(value: string) {
        this._url = value;
        this.valid = this.isValid();
    }
    public get url(): string {
        return this._url;
    }

    public set emailAddress(value: string) {
      this._emailAddress = value;
      this.valid = this.isValid();
    }
    public get emailAddress(): string {
      return this._emailAddress;
    }

    public get activeTab(): number {
      return this._activeTab;
    }
    public set activeTab(value: number) {
      this._activeTab = value;
      this.valid = this.isValid();
    }

    public target: number = 0;
    public subject: string = '';
    public valid: boolean = false;
    public emailAddressValid: boolean = false;

    private _url: string = 'https://';
    private _emailAddress: string = '';
    public _activeTab = 0;

    constructor(
      private readonly modalInstance: SkyModalInstance,
      modalContext: SkyUrlModalContext
    ) {
      if (modalContext.urlResult) {
        if (modalContext.urlResult.url.startsWith(emailKey)) {
          this.emailAddress = modalContext.urlResult.url.replace(emailKey, '');

          let queryStringIndex = this.emailAddress.indexOf(queryStringParamKey);
          queryStringIndex = queryStringIndex > -1 ? queryStringIndex : this.emailAddress.indexOf(queryStringParamKey.toLowerCase());

          if (queryStringIndex > -1) {
            this.subject = decodeURI(this.emailAddress).slice(queryStringIndex + queryStringParamKey.length);
            this.emailAddress = this.emailAddress.slice(0, queryStringIndex);
          }

          // Set active tab to email
          this.activeTab = 1;
        } else {
          this.url = modalContext.urlResult.url,
          this.target = modalContext.urlResult.target as any;

          // set active tab to web page
          this.activeTab = 0;
        }
      }
    }

    public activeTabChanged(value: number) {
      this.activeTab = value;
    }

    public save() {
      if (this.isValid()) {
        if (this.activeTab === 0) {
          this.modalInstance.save({
              url: this.url,
              target: this.target ? parseInt(this.target as any, undefined) : UrlTarget.None
          } as UrlModalResult);
        } else {
          this.modalInstance.save({
              url: this.getEmailUrl(),
              target: UrlTarget.None
          } as UrlModalResult);
        }
      }
    }

    public cancel() {
      this.modalInstance.cancel();
    }

    private getEmailUrl(): string {
      return emailKey + this.emailAddress + (this.subject ? '?Subject=' + encodeURI(this.subject) : '');
    }

    private isValid(): boolean {
      if (this.activeTab === 0) {
        return !!this.url && SkyValidation.isUrl(this.url);
      }
      return !!this.emailAddress && SkyValidation.isEmail(this.emailAddress);
    }
}
