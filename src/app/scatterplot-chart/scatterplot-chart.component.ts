import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {UtilService} from '../util.service';

@Component({
  selector: 'app-scatterplot-chart',
  templateUrl: './scatterplot-chart.component.html',
  styleUrls: ['./scatterplot-chart.component.css']
})
export class ScatterplotChartComponent implements OnInit {

  constructor(private http: HttpClient, private el: ElementRef, private utilService: UtilService) {
  }

  ngOnInit() {
    const margin = {top: 10, right: 20, left: 40, bottom: 50};
    const width = this.el.nativeElement.offsetWidth - margin.left - margin.right;
    const height = this.el.nativeElement.offsetHeight - margin.top - margin.bottom;

    const svg = d3.select('.scatter-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .call(this.utilService.responsify)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);


    this.http.get('assets/demo_data/cereal.json')
      .subscribe((data: any) => {
        const yScaleRange: number[] = d3.extent(data, ((d: any) => {
          return parseInt(d.Protein, 10);
        }));
        const yScale = d3.scaleLinear()
          .domain(yScaleRange)
          .range([height, 0])
          .nice();

        const yAxes = d3.axisLeft(yScale);
        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxes)
          .append('text')
          .attr('fill', '#000')
          .attr('class', 'label')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Protein (g)');

        const xScaleRange: number[] = d3.extent(data, ((d: any) => {
          return parseInt(d.Calories, 10);
        }));
        const xScale = d3.scaleLinear()
          .domain(xScaleRange)
          .range([0, width])
          .nice();

        const xAxes = d3
          .axisBottom(xScale)
          .ticks(5);

        svg.append('g')
          .attr('transform', `translate(0, ${height})`) // set to bottom
          .call(xAxes)
          .append('text')
          .attr('fill', '#000')
          .attr('class', 'label')
          .attr('x', width)
          .attr('y', -6)
          .style('text-anchor', 'end')
          .text('Calories');


        const manufacture = d3.map<string>(data, ((d: any) => {
          return d.Manufacturer;
        })).keys();

        const color = d3.schemeCategory10;

        const legendMap: any = {};
        for (let i = 0; i < manufacture.length; i++) {
          legendMap[manufacture[i]] = color[i];
        }


        const circles = svg.selectAll('.ball')
          .data(data)
          .enter()
          .append('g')
          .attr('class', 'ball')
          .attr('transform', (d: any) => {
            return `translate(${xScale(d.Calories)}, ${yScale(d.Protein)})`;
          });

        circles
          .append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 5)
          .style('fill', (d: any) =>  legendMap[d.Manufacturer]);


      const legend = svg.selectAll('.legend')
          .data(manufacture)
          .enter()
          .append('g')
          .attr('class', 'legend')
          .attr('transform', (d, i) => 'translate(0,' + i * 15 + ')');

      // draw legend colored rectangles
      legend.append('rect')
          .attr('x', width - 8)
          .attr('width', 8)
          .attr('height', 8)
          .style('fill', (d: any, i) => legendMap[d]);

      // draw legend text
      legend.append('text')
          .attr('x', width - 15)
          .attr('y', 5)
          .attr('dy', '.18em')
          .style('text-anchor', 'end')
          .style('font-size', '10px')
          .text((d: any, i) => Object.keys(legendMap)[i]);

      }, (err) => {
        console.error(err);
      });
  }

}
