import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UtilService } from '../util.service';
import { EventService } from '../event.service';

import domToImage from 'dom-to-image';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as _ from 'lodash';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  private dashboardContainer: HTMLElement;
  private isViewReady: boolean;
  private dimensions: any;
  private settings: any;

  public loading: boolean;


  constructor(private eventService: EventService, private utilService: UtilService) {

    /**
     * Subscribe to click snapshot event
     */
    this.eventService.clickSnapshot.subscribe((message: string) => {
      if (message != null && message.trim() !== '') {
        this.clickSnapshot();
      }
    });

    /**
     * Subscribe to setting update event.
     */
    this.eventService.settingUpdate.subscribe((settings: any) => {
      this.settings = settings;
    });


    // Setting default values

    this.isViewReady = false;
    this.loading = false;
    this.dimensions = {
      height: 0,
      width: 0,
      aspectRatio: 0
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dashboardContainer = document.getElementById('graph-container');
    this.dimensions.width = this.dashboardContainer.offsetWidth;
    this.dimensions.height = this.dashboardContainer.offsetHeight;
    this.dimensions.aspectRatio = this.dimensions.width / this.dimensions.height;

    this.isViewReady = true;
  }


  public clickSnapshot() {
    if (this.isViewReady) {
      this.loading = true;

      // Creates PNG image base64 data url from dom element.
      domToImage.toPng(this.dashboardContainer).then((dataUrl) => {

        // Get Pdf Setting to create PDF.
        const pdfSetting = this.getPdfSetting();

        // Basic PDF Doc definition
        const docDefinition = {
          pageSize: pdfSetting.pageSize,
          pageMargins: pdfSetting.pageMargin,
          pageOrientation: pdfSetting.pageOrientation,
          content: [
            // Add generated Image Content.
            _.extend({image: dataUrl}, pdfSetting.imageSetting)
          ]
        };

        // Apply pdf orientation setting.
        if (pdfSetting.pageOrientation) {
          _.extend({pageOrientation: pdfSetting.pageOrientation}, docDefinition);
        }

        // Call method to create PDF from doc definition.
        pdfMake.createPdf(docDefinition)
          .download(`graph-pdf-${Date.now()}.pdf`, () => {
            this.loading = false;
          });

      }).catch(function (error) {
          console.error('oops, something went wrong!', error);
      });

    }
  }

  /**
   * Method to return pdf setting based on preferences.
   * @return Pdf Setting {any}
   */
  private getPdfSetting(): any {

    const pdfSetting: any = this.utilService.getDefaultPageSetting();

    // Basic PDF Size Array
    const defaultPageSize = this.utilService.defaultPageSize;

    // Assign dom width and height to image width and height
    pdfSetting.imageSetting.width = this.utilService.fromPxToPt(this.dimensions.width);
    pdfSetting.imageSetting.height = this.utilService.fromPxToPt(this.dimensions.height);

    if (this.settings.orientation === 'Auto' && this.settings.pageSize === 'Auto') {
      // Create PDF of image size + margin.
      pdfSetting.pageSize.width = this.utilService.fromPxToPt(this.dimensions.width) + 20;
      pdfSetting.pageSize.height = this.utilService.fromPxToPt(this.dimensions.height) + 20;
    } else {
      if (this.settings.orientation !== 'Auto') {
        // Assign page orientation.
        pdfSetting.pageOrientation = this.settings.orientation.toLowerCase();
      }
      if (this.settings.pageSize !== 'Auto') {
        pdfSetting.pageSize = this.settings.pageSize;
        // map page size from defaultPageSize array after reducing marign.
        const pageSize = defaultPageSize[this.settings.pageSize.toUpperCase()].map((value) => {
          return value - 20;
        });

        // determine width index based on orientation.
        let widthIndex = 0;
        let heightIndex: number;
        if (pdfSetting.pageOrientation === 'landscape') {
          widthIndex = 1;
        }
        heightIndex = 1 - widthIndex;

        // If both page width and height is greater than image width and height.
        if (pageSize[widthIndex] < pdfSetting.imageSetting.width && pageSize[heightIndex] < pdfSetting.imageSetting.height) {
          // If width diff is more than height diff
          if ((pdfSetting.imageSetting.width - pageSize[widthIndex]) >= (pdfSetting.imageSetting.height - pageSize[heightIndex])) {
            // Assign image width to page width
            pdfSetting.imageSetting.width = pageSize[widthIndex];
            // calculate height using aspect ratio
            pdfSetting.imageSetting.height = pageSize[widthIndex] / this.dimensions.aspectRatio;

          } else {
            // Assign image height to page height
            pdfSetting.imageSetting.height = pageSize[heightIndex];
            // calculate width using aspect ratio
            pdfSetting.imageSetting.width = pageSize[heightIndex] * this.dimensions.aspectRatio;
          }
        } else if (pageSize[widthIndex] < pdfSetting.imageSetting.width) {
          pdfSetting.imageSetting.width = pageSize[widthIndex];
          pdfSetting.imageSetting.height = pageSize[widthIndex] / this.dimensions.aspectRatio;
        } else if (pageSize[heightIndex] < pdfSetting.imageSetting.height) {
          pdfSetting.imageSetting.height = pageSize[heightIndex];
          pdfSetting.imageSetting.width = pageSize[heightIndex] * this.dimensions.aspectRatio;
        }
        // center image to page width.
        pdfSetting.imageSetting.margin[0] = (pageSize[widthIndex] - pdfSetting.imageSetting.width) * 0.5;

      }
    }

    return pdfSetting;
  }
}
