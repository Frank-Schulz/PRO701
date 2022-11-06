import { select } from 'd3';

export const tooltip = select('body')
  .append('div')
  .attr('class', 'd3-tooltip');

export const label = select('d3-labels')
  .append('div')
  .attr('class', 'd3-label');
