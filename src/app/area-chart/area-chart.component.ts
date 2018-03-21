import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from '../util.service';
import * as d3 from 'd3';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css']
})
export class AreaChartComponent implements OnInit {

  constructor(private http: HttpClient, private el: ElementRef, private utilService: UtilService) { }

    ngOnInit() {
      const margin = { top: 10, right: 20, left: 40, bottom: 50};
      const width = this.el.nativeElement.offsetWidth - margin.left - margin.right;
      const height = this.el.nativeElement.offsetHeight - margin.top - margin.bottom;

      const svg = d3.select('.area-chart')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .call(this.utilService.responsify)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      this.http.get('assets/demo_data/stocks.json')
        .subscribe((data: any) => {
          const parseTime = d3.timeParse('%Y/%m/%d');
          data.forEach(company => {
            company.values.forEach(d => {
              d.date = parseTime(d.date);
              d.close = +d.close;
            });
          });

          const xScaleRange: Date[] = [
            d3.min(data, ((co: any) => d3.min(co.values, ((d: any) => new Date(d.date))))),
            d3.max(data, ((co: any) => d3.max(co.values, ((d: any) => new Date(d.date)))))
          ];

          const xScale = d3.scaleTime()
            .domain(xScaleRange)
            .range([0, width]);

          svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).ticks(5));


          const yScaleRange: number[] = [
            parseInt(d3.min(data, ((co: any) => d3.min(co.values, ((d: any) => d.close)))), 10),
            parseInt(d3.max(data, ((co: any) => d3.max(co.values, ((d: any) => d.close)))), 10),
          ];

          const yScale = d3
            .scaleLinear()
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

          // *******************
          // Until here is identical to line chart.
          // *******************

          const area = d3.area()
            .x(((d: any) => xScale(d.date)))
            .y0(yScale(yScale.domain()[0])) // pass the bottom of the scale, the 0 val
            .y1(((d: any) => yScale(d.close)))
            .curve(d3.curveCatmullRom.alpha(0.5));

          svg
            .selectAll('.area')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'area')
            .attr('d', ((d: any) => area(d.values)))
            .style('stroke', (d, i) => ['#FF9900', '#3369E8'][i])
            .style('stroke-width', 2)
            .style('fill', (d, i) => ['#FF9900', '#3369E8'][i])
            .style('fill-opacity', 0.5);
        });
    }

  }

