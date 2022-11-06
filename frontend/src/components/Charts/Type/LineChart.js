import React, { useRef, useLayoutEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { interpolate, line, select, easeLinear, scaleLinear } from 'd3';
import { color } from '../constants';
import { widthAtom, heightAtom, marginAtom } from '../chartStates';

export const LineChart = ({ data, xDomain, yDomain }) => {
  const width = useRecoilValue(widthAtom);
  const height = useRecoilValue(heightAtom);
  const { left, right, top, bottom } = useRecoilValue(marginAtom);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    select(containerRef.current).selectAll('*').remove();

    const x = scaleLinear()
      .domain(xDomain)
      .range([ left, width - right ]);
    const y = scaleLinear()
      .domain(yDomain)
      .range([ height - bottom, top ]);

    const lineFn = line()
      .x((_, i) => x(i))
      .y((d) => y(d));

    const reveal = (path) =>
      path
        .transition()
        .duration(5000)
        .ease(easeLinear)
        .attrTween('stroke-dasharray', function () {
          const length = this.getTotalLength();
          console.log(interpolate(`0, ${length}`, `${length}, ${length}`));
          return interpolate(`0, ${length}`, `${length}, ${length}`);
        });

    data.forEach(([ _, ...values ], index) => {
      select(containerRef.current)
        .append('path')
        .datum(values)
        .attr('fill', 'none')
        .attr('stroke', () => color(index))
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', lineFn)
        .call(reveal);
    });
  }, [ bottom, data, height, left, right, top, width, xDomain, yDomain ]);

  return <g ref={containerRef} />;
};
