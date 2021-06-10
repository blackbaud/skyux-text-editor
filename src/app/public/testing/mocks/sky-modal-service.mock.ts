import { of } from 'rxjs';

export class MockSkyModalService {
  public open(component: any, providers: any[]) {
    return {
      closed: of({ reason: 'save' })
    };
  }
}
