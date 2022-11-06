import React, { useLayoutEffect } from 'react';
import { useRecoilState } from 'recoil';
import { widthAtom, heightAtom, marginAtom } from './chartStates';
import { XAxis } from './XAxis';
import { YAxis } from './YAxis';
import { LineChart } from './Type/LineChart';
import { BarChart } from './Type/BarChart';
import { TreeChart as StaticTree } from './Type/TreeChart(static)';
import { TreeChart } from './Type/TreeChart(dynamic)';
import { Legend } from './Legend';
import * as d3 from 'd3';

import './chart.css';

export const Chart = ({ width, height, margin, data }) => {
  const [ , setWidth ] = useRecoilState(widthAtom);
  const [ , setHeight ] = useRecoilState(heightAtom);
  const [ , setMargin ] = useRecoilState(marginAtom);

  useLayoutEffect(() => {
    setWidth(width);
    setHeight(height);
    if (margin) {
      setMargin(margin);
    }

    // selectors
    const svg = d3.select('svg'),
      chartGroup = svg.select('#SVGcontainer');

    svg.attr("style", "outline: thin solid black;")

    // zoom and translation !do not separate (doesn't work for some reason)
    svg.call(
      d3.zoom()
        .scaleExtent([ 0.25, 2 ])
        .on("zoom", ({ transform }) => {
          chartGroup.attr("transform", transform);
        }));

  }, [ width, height, margin, setWidth, setHeight, setMargin ]);

  const keys = [];
  let yMax = 0;
  const longestColumn = data.columns.reduce((length, column) => {
    keys.push(column[ 0 ]);
    yMax = Math.max(yMax, Math.max(...column.slice(1)));
    return Math.max(length, column.length);
  }, 0);
  const tickCount = Math.max(
    data.type === 'bar' ? longestColumn - 1 : longestColumn - 2,
    0
  );
  const xDomain = [ 0, tickCount ];
  const yDomain = [ 0, yMax ];

  return (
    <div style={{ flexFlow: "column" }} >
      <svg width={width} height={height} viewBox={`0, 0, ${width}, ${height}`}>
        <g cursor="grab" id="SVGcontainer" className="svg-content-responsive">
          {data.type === 'bar' && (
            <BarChart data={data.columns} xDomain={xDomain} yDomain={yDomain} />
          )}
          {data.type === 'line' && (
            <LineChart data={data.columns} xDomain={xDomain} yDomain={yDomain} />
          )}
          {data.type === 'tree' && (
            <TreeChart treeRoot={data.treeRoot} xDomain={xDomain} yDomain={yDomain} />
          )}
          {!data.type === 'tree' && <>
            <XAxis margin={margin} xDomain={xDomain} tickCount={tickCount} />
            <YAxis margin={margin} yDomain={yDomain} tickCount={5} />
            <Legend keys={keys} xDomain={[ 0, data.columns.length + 1 ]} />
          </>}
        </g>
      </svg>
      {/* <svg width={width} height={height} viewBox={`0, 0, ${width}, ${height}`}>
        <StaticTree treeRoot={data.treeRoot} xDomain={xDomain} yDomain={yDomain} />
      </svg> */}
    </div>
  );
};
