import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public toggleState: boolean;

  constructor(private eventService: EventService) {
    // Initialize and listen to toggle state.
    this.eventService.sidebarToggleState.subscribe((toggleState) => {
      this.toggleState = toggleState;
    });
  }

  ngOnInit() {
  }


  /**
   * Method to hanadle snapshot button click and create a click event.
   */
  public clickSnapshot() {
    this.eventService.clickSnapshot.next('click');
  }

  /**
   * Method to open sidebar menu.
   */
  public toggleSidebar() {
    this.toggleState = !this.toggleState;
    this.eventService.sidebarToggleState.next(this.toggleState);
  }


}
