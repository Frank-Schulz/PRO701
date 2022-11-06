import * as d3 from 'd3';
import { select } from 'd3';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { heightAtom, marginAtom, widthAtom } from '../chartStates';
import { tooltip } from '../Chart components/chartInfo';
import { PersonBox } from '../Chart components/PersonBox';



export function TreeChart({ treeRoot, xDomain, yDomain }) {
  const width = useRecoilValue(widthAtom);
  const height = useRecoilValue(heightAtom);

  const personBox = {
    width: 150,
    height: 62,
    margin: {
      x: 40,
      y: 10,
    }
  }

  const [ treeDirection, setTreeDirection ] = useState("horizontal");
  function toggleLayout() {
    treeDirection === "horizontal" ?
      setTreeDirection("vertical") : setTreeDirection("horizontal");
  };

  const containerRef = useRef(null);
  const dx = 50;
  const dy = width / 8;
  const margin = ({ top: 10, right: 120, bottom: 10, left: 40 });
  const tree = d3.tree()
    .nodeSize([
      personBox.height + personBox.margin.y,
      personBox.width + personBox.margin.x ])
    .separation(() => 1.1);

  const root = d3.hierarchy(treeRoot);

  let direction, treeStart, diagonal;

  // switch direction of tree
  if (treeDirection === "horizontal") {
    direction = (d) => { return `${d.y},${d.x}` }
    treeStart = `${dy},${height / 2}`;
    diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
  }
  else {
    direction = (d) => { return `${d.x},${d.y}` }
    treeStart = `${width / 2},${dx}`;
    diagonal = d3.linkVertical().x(d => d.x).y(d => d.y);
  }
  root.x0 = dy / 2;
  root.y0 = 0;

  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth > 0) d.children = null;
  });

  useLayoutEffect(() => {
    select(containerRef.current).selectAll('*').remove();

    const group = select(containerRef.current)
      .attr("viewBox", [ -margin.left, -margin.top, width, dx ])
      .style("font", "10px sans-serif")
      .style("user-select", "none")
      .attr('transform', `translate(${treeStart})`);

    const gLink = group.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = group.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    function update(source) {
      const duration = source && source.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout.
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;

      const transition = group.transition()
        .duration(duration)
        .attr("viewBox", [ -margin.left, left.x - margin.top, width, height ])
        .tween("resize", window.ResizeObserver ? null : () => () => group.dispatch("toggle"));

      // Update the nodes…
      const node = gNode
        .selectAll("g")
        .data(nodes, d => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter()
        .append("g")
        .attr("transform", d => `translate(${direction(source)})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

      // Add html for people's details to be displayed
      nodeEnter.append('foreignObject')
        .attr('class', 'frame')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 0)
        .attr('height', 0)
        .html((d) => {
          const person = d.data.data;
          return `${PersonBox(person)}`
        });

      // Add 'has children' indicator circles
      nodeEnter.append('circle')
        .attr('class', 'hasChildren')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 4);

      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter)
        .transition(transition)
        .attr("transform", d => `translate(${direction(d)})`)
        // .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      // Update the frames
      nodeUpdate.select('foreignObject.frame')
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1)
        .attr('x', -(personBox.width / 2))
        .attr('y', -(personBox.height / 2))
        .attr('width', personBox.width)
        .attr('height', personBox.height);

      // Update the 'has children' indicator circles
      nodeUpdate.select('circle.hasChildren')
        .attr('cx', (personBox.width / 2))
        .attr('cy', 0)
        .attr("fill-opacity", d => d._children ? 1 : 0)
        .attr("stroke-opacity", d => d._children ? 1 : 0);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit()
        .transition(transition)
        .remove()
        .attr("transform", d => `translate(${direction(source)})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // Update the links…
      const link = gLink.selectAll("path")
        .data(links, d => d.target.id);

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter()
        .append("path")
        .attr('class', 'links')
        .attr("d", d => {
          const o = { x: source.x0, y: source.y0 };
          return transitionElbow({ source: o, target: o });
        });

      // Transition links to their new position.
      link.merge(linkEnter)
        .transition(transition)
        .attr("d", d => elbow(d));

      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = { x: source.x, y: source.y };
          return transitionElbow({ source: o, target: o });
        });

      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);

    function transitionElbow(d) {
      return 'M' + d.source.y + ',' + d.source.x
        + 'H' + d.source.y
        + 'V' + d.source.x
        + 'H' + d.source.y;
    }

    function elbow(d) {
      // start point x1, y1
      const x1 = d.source.y + (personBox.width / 2);
      const y1 = d.source.x;
      // endpoint x4, y4
      const x4 = d.target.y - (personBox.width / 2);
      const y4 = d.target.x;

      const x2 = x1 + (x4 - x1) / 2;
      const y2 = y1;

      const x3 = x2;
      const y3 = y4;

      return `M${x1},${y1}H${x2}V${y2 + (y3 - y2)}H${x4}`;
    }

  }, [ treeRoot, width, height, xDomain, yDomain ])


  return <g ref={containerRef} />
}
