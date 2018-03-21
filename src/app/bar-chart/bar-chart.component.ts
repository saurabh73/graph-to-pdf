import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilService } from '../util.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  constructor(private http: HttpClient, private el: ElementRef, private utilService: UtilService) { }

  ngOnInit() {
    const margin = { top: 10, right: 20, left: 40, bottom: 50};
    const width = this.el.nativeElement.offsetWidth - margin.left - margin.right;
    const height = this.el.nativeElement.offsetHeight - margin.top - margin.bottom;

    const svg = d3.select('.bar-chart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .call(this.utilService.responsify)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

      this.http.get('assets/demo_data/character.json')
      .subscribe((data: any) => {

        const xScaleRange = data.map((d) => d.letter);

        const xScale = d3.scaleBand()
        .domain(xScaleRange)
        .rangeRound([0, width])
        .padding(0.1);

        const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d: any) => parseFloat(d.frequency))])
        .rangeRound([height, 0]);


        svg.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xScale).ticks(5));

        svg.append('g')
          .attr('class', 'axis axis--y')
          .call(d3.axisLeft(yScale)
          .ticks(10, '%'))
          .append('text')
          .attr('fill', '#000')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '0.71em')
          .attr('text-anchor', 'end')
          .text('Frequency');

        svg.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', (d: any) => xScale(d.letter))
            .attr('y', (d: any) => yScale(d.frequency))
            .attr('width', xScale.bandwidth())
            .style('fill', 'steelblue')
            .attr('height', (d: any) => height - yScale(d.frequency));

      });
  }

}
