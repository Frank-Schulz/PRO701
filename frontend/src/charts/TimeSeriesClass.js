import React, { Component, useState, useEffect } from 'react'
import * as d3 from 'd3';

export default class TimeSeriesClass extends Component {
  constructor(props) {
    super(props);
    this.csvURL = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv";
    this.width = props.width;
    this.height = props.height;
    this.state = {
      data: []
    }
  }

  //gets csv data from a csv
  // ex. [{data: '2021-12-12', value: 1000}]
  getURLData = async () => {
    let data = [];
    await d3.csv(this.csvURL,
      (() => { }),
      function (d) {
        data.push({ date: d3.timeParse("%Y-%m-%d")(d.date), value: parseFloat(d.value) })
      })
    return data
  }

  drawChart = () => {
    // establish margins
    const margin = { top: 10, right: 50, bottom: 50, left: 50 }
    //create the chart area
    const svg = d3
      .select('#time_series_class')
      .append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add X axis --> it is a date format, returns an array of min max values [xmin, xmax]
    var x = d3.scaleTime()
      .domain(d3.extent(this.state.data, function (d) { return d.date; }))
      .range([ 0, this.width ]);

    svg.append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(x));

    //Add Y axis
    var y = d3.scaleLinear()
      .domain([ 0, d3.max(this.state.data, function (d) { return +d.value; }) ])
      .range([ this.height, 0 ]);

    svg.append('g')
      .call(d3.axisLeft(y));

    // set line coordinates
    const line = d3.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) });

    //Add the line
    svg.append('path')
      .datum(this.state.data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  }

  componentDidMount() {
    if (this.state.data.length > 0) {
      this.drawChart();
    } else {
      this.setState({ data: this.getURLData() });
    }
  }

  render() {

    return (
      <div>
        <h4>Time Series Class</h4>
        <div id='time_series_class' />
      </div >
    )
  }
}
