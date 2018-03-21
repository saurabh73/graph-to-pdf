import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from '../util.service';
import * as d3 from 'd3';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  constructor(private http: HttpClient, private el: ElementRef, private utilService: UtilService) {
  }

  ngOnInit() {
    const margin = { top: 10, right: 20, left: 40, bottom: 50};
    const width = this.el.nativeElement.offsetWidth - margin.left - margin.right;
    const height = this.el.nativeElement.offsetHeight - margin.top - margin.bottom;

    const svg = d3.select('.line-chart')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .call(this.utilService.responsify)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    this.http.get('assets/demo_data/bitcoin.json')
    .subscribe((data: any) => {
      const parseTime = d3.timeParse('%m/%d/%y');

      data.forEach((d: any) => {
          d.Date = parseTime(d.Date);
          return d;
      });

      const xScaleRange: Date[] = [
        d3.min(data,  (d: any) => new Date(d.Date)),
        d3.max(data,  (d: any) => new Date(d.Date))
      ];

      const xScale = d3.scaleTime()
        .domain(xScaleRange)
        .range([0, width]);

      svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(5));

      const yScaleRange: any[] = [ 0, d3.max(data, (d: any) => d.Price)];

      const yScale = d3.scaleLinear()
        .domain(yScaleRange)
        .range([height, 0]);

      svg.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Price ($)');

      const line = d3.line()
      .x((d: any) => xScale(d.Date))
      .y((d: any) => yScale(d.Price))
      .curve(d3.curveCatmullRom.alpha(0.5));

      svg.append('path')
          .datum(data)
          .attr('class', 'line')
          .attr('d', line)
          .style('stroke', 'steelblue')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .style('stroke-width', 2)
          .style('fill', 'none');

    }, (err) => {
      console.error(err);
    });

  }


}
