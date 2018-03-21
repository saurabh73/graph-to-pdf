import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarModule } from 'ng-sidebar';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ScatterplotChartComponent } from './scatterplot-chart/scatterplot-chart.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';

import { EventService } from './event.service';
import { UtilService } from './util.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    BarChartComponent,
    AreaChartComponent,
    LineChartComponent,
    ScatterplotChartComponent,
    SidebarMenuComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SidebarModule.forRoot()
  ],
  providers: [
    EventService,
    UtilService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
