import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Sidebar } from 'ng-sidebar';
import { EventService } from './event.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {


  @ViewChild('sidebar')
  public sidebar: Sidebar;

  constructor(private eventService: EventService) {}

  ngAfterViewInit(): void {

    // Toggle Sidebar Menu based on event.
    this.eventService.sidebarToggleState.subscribe((toggleState) => {
      toggleState ? this.sidebar.open() : this.sidebar.close();
    });
  }

  ngOnInit(): void {
  }

}
