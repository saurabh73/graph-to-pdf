import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class EventService {

  /**
   * @type {BehaviorSubject<boolean>}
   *
   */
  public sidebarToggleState: BehaviorSubject<boolean>;

  /**
   * @type {BehaviorSubject<string>}
   * Behaviour Subject to trigger snapshot click
   */
  public clickSnapshot: BehaviorSubject<string>;

  /**
   * @type {BehaviorSubject<any>}
   * Behaviour Subject to update settings
   */
  public settingUpdate: BehaviorSubject<any>;

  constructor() {
    this.sidebarToggleState  = new BehaviorSubject(false);
    this.clickSnapshot = new BehaviorSubject('');
    this.settingUpdate = new BehaviorSubject({
      orientation: 'Auto',
      pageSize: 'Auto'
    });
  }

}
