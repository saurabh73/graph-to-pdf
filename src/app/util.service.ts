import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable()
export class UtilService {

  constructor() { }

  public defaultPageSize: any = {
    'A2': [1190.55, 1683.78],
    'A3': [841.89, 1190.55],
    'A4': [595.28, 841.89],
    'A5': [419.53, 595.28],
    'A6': [297.64, 419.53],
    'LETTER': [612, 792],
    'LEGAL': [612, 1008],
    'TABLOID': [792, 1224]
  };

  public responsify(svg) {
    const container = d3.select(svg.node().parentNode),
      w = parseInt(svg.style('width'), 10),
      h = parseInt(svg.style('height'), 10),
      aspect = w / h;

    svg.attr('viewBox', '0 0 ' + w + ' ' + h)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);

    d3.select(window).on('resize.' + container.attr('id'), resize);

    function resize() {
      const targetWidth = parseInt(container.style('width'), 10);
      svg.attr('width', targetWidth);
      svg.attr('height', Math.round(targetWidth / aspect));
    }
  }


  /**
   * Method to return default page setting.
   * @returns {{pageSize: {height: number, width: number}, pageMargin: [number,number,number,number], imageSetting: {height: number, width: number, margin: [number,number]}}}
   */
  public getDefaultPageSetting(): any {
    return {
      pageSize: {
        height: 0,
        width: 0
      },
      pageMargin: [10, 10, 10, 10],
      imageSetting: {
        height: 0,
        width: 0,
        margin: [0, 0]
      }
    };
  }

  /**
   * Method to return page dimension in inch x inch
   * @param pageSize
   * @returns {string}
   */
  public getPageDimension(pageSize): string {
    pageSize = pageSize.toUpperCase();
    if (pageSize !== 'AUTO') {
      return `${(this.defaultPageSize[pageSize][0] / 72).toFixed(2)} in x ${(this.defaultPageSize[pageSize][1] / 72).toFixed(2)} in`;
    } else {
      return 'best fit';
    }
  }

  /**
   * Method to convert px value to pt
   * @param pixelValue
   * @returns ptValue {number}
   */
  public fromPxToPt(pixelValue: number): number {
    return pixelValue * 0.75;
  }



}
