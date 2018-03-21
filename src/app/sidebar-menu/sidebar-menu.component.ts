import { Component, OnInit} from '@angular/core';
import { EventService } from '../event.service';
import {UtilService} from '../util.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  public toggleState: boolean;
  public pageSetting: any;
  public pageSettingOptions: any;
  private  defaultPageSize: any;

  constructor(private eventService: EventService, public utilService: UtilService) {

    this.defaultPageSize = this.utilService.defaultPageSize;

    this.pageSettingOptions = {
      orientationOptions: ['Auto', 'Landscape', 'Portrait'],
      pageSizeOptions: ['Auto', 'A2', 'A3', 'A4', 'A5', 'A6', 'Letter', 'Legal', 'Tabloid' ]
    };

    /**
     * Subscribe to setting sidebar toggle event.
     */
    this.eventService.sidebarToggleState.subscribe((toggleState) => {
      this.toggleState = toggleState;
    });

    /**
     * Subscribe to setting update event.
     */
    this.eventService.settingUpdate.subscribe((settings) => {
      this.pageSetting = settings;
    });

  }

  ngOnInit() {
  }

  /**
   * Event Handler to toggle sidebar.
   */
  public toggleSidebar() {
    this.toggleState = !this.toggleState;
    this.eventService.sidebarToggleState.next(this.toggleState);
  }

  /**
   * Method to update page setting from side bar
   * @param isOrientationSetting
   * @param value
   */
  public updatePageSetting(isOrientationSetting, value) {
    if (isOrientationSetting) {
      this.pageSetting.orientation = value;
      // Update to default setting if orientation is auto.
      if (this.pageSetting.orientation === 'Auto' ) {
        this.pageSetting.pageSize = 'Auto';
      }
    } else {
      this.pageSetting.pageSize = value;

      // Update to default setting if page size is auto.
      if (this.pageSetting.pageSize === 'Auto') {
        this.pageSetting.orientation = 'Auto';
      }
    }
    // emit setting update event
    this.eventService.settingUpdate.next(this.pageSetting);

  }

}
