import { select, tree, hierarchy } from 'd3';
import React, { useLayoutEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { heightAtom, marginAtom, widthAtom } from '../chartStates';
import { tooltip } from '../Chart components/chartInfo';

/* -------------------------------------------------------------------------- */
/*                     Second iteration of the tree chart                     */
/* -------------------------------------------------------------------------- */

export function TreeChart({ treeRoot, xDomain, yDomain }) {
  const width = useRecoilValue(widthAtom);
  const height = useRecoilValue(heightAtom);
  const { left, right, top, bottom } = useRecoilValue(marginAtom);
  const containerRef = useRef(null);

  const nodes = {
    type: "circle",
    x: "cx",
    y: "cy",
  }

  useLayoutEffect(() => {
    select(containerRef.current).selectAll('*').remove();

    const chartGroup = select(containerRef.current)
      .attr('transform', `translate(${left}, ${top})`);

    var root = hierarchy(treeRoot);

    root.sort();

    // root.descendants().forEach((d, i) => {
    //   d.id = i;
    //   d._children = d.children;
    //   if (d.depth !== 0) d.children = null;
    // });

    const familyTree = tree()
      .size([ width - left - right, height - top - bottom ]);

    familyTree(root);

    chartGroup.selectAll(nodes.type)
      .data(root.descendants())
      .enter().append(nodes.type)
      .attr(nodes.x, (d) => { return d.x; })
      .attr(nodes.y, (d) => { return d.y; })
      .attr("r", "5")

      .append("div")
      .html((d) => { return d.data.data.fullName })
      .style('left', (d) => { return (d.x - 35) + 'px' })
      .style('top', (d) => { return (d.y - 30) + 'px' })
      .attr('class', 'd3-label');

    chartGroup.on('mouseover', (event) => {
      let person = event.target.__data__.data.data;
      console.log(event);
      tooltip.transition().duration(200)
        .style('opacity', .9)

      tooltip.html(person.fullName)
        .style('left', (event.pageX - tooltip.node().offsetWidth / 2) + 'px')
        .style('top', (event.pageY - 30) + 'px');
    })
      .on('mouseout', () => {
        tooltip.transition().duration(200)
          .style('opacity', 0)
      })

    chartGroup.selectAll("path")
      .data(root.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .attr("d", (d) => {
        return `
        M${d.x},${d.y}
        C${d.x},${(d.parent.y + d.y) / 2}
         ${d.parent.x},${(d.y + d.parent.y) / 2}
         ${d.parent.x},${d.parent.y}`
      })

  }, [ treeRoot, width, height, left, right, top, bottom, xDomain, yDomain ])


  return <g ref={containerRef} />;
}
