import * as d3 from 'd3';
import { select } from 'd3';
import React, { useLayoutEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { PersonBox } from '../Chart components/PersonBox';
import { heightAtom, widthAtom } from '../chartStates';
import * as DynamicTree from '../Chart components/DynamicTree';

/* -------------------------------------------------------------------------- */
/*                      Fifth iteration of the tree chart                     */
/* -------------------------------------------------------------------------- */

export function TreeChart({ treeRoot, xDomain, yDomain }) {
  const width = useRecoilValue(widthAtom);
  const height = useRecoilValue(heightAtom);

  const nodeSize = {
    width: 180,
    height: 72,
    margin: {
      x: 40,
      y: 10,
    }
  }

  // const [ treeDirection, setTreeDirection ] = useState("horizontal");

  //REVIEW: Potential future option to toggle chart direction
  // function toggleLayout() {
  //   treeDirection === "horizontal" ?
  //     setTreeDirection("vertical") : setTreeDirection("horizontal");
  // };

  const containerRef = useRef(null);
  const dx = 50;
  const dy = width / 8;
  const margin = ({ top: 20, right: 20, bottom: 20, left: 20 });
  const tree = d3.tree()
    .nodeSize([
      nodeSize.height + nodeSize.margin.y,
      nodeSize.width + nodeSize.margin.x ])
    .separation(() => 1.1);

  let direction, rootCoords, diagonal;
  let i = 0;

  // switch direction of tree
  // if (treeDirection === "horizontal") {
  direction = (d) => { return `${d.y},${d.x}` }
  diagonal = d3.linkHorizontal()
    .x(d => d.y)
    .y(d => d.x);
  rootCoords = {
    x: (nodeSize.width / 2) + nodeSize.margin.x,
    y: height / 2
  };
  // }
  // else {
  //   direction = (d) => { return `${d.x},${d.y}` }
  //   treeStart = `${width / 2},${dx}`;
  //   diagonal = d3.linkVertical().x(d => d.x).y(d => d.y);
  // }
  useLayoutEffect(() => {
    select(containerRef.current).selectAll('*').remove();

    const root = d3.hierarchy(treeRoot);
    root.x0 = height / 2;
    root.y0 = 0;

    // Collapse all visible child nodes
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }
    collapse(root);

    const group = select(containerRef.current)
      .attr("viewBox", [ -margin.left, -margin.top, width, dx ])
      .style("font", "10px sans-serif")
      .style("user-select", "none")
      .attr('transform', `translate(${rootCoords.x},${rootCoords.y})`);

    const gLink = group.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = group.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    update(root);
    function update(source) {
      const duration = source && source.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout.
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x)
          left = node;
        if (node.x > right.x)
          right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;

      const transition = group.transition()
        .duration(duration)
        .attr("viewBox", [ -margin.left, left.x - margin.top, width, height ])
        .tween("resize", window.ResizeObserver ? null : () => () => group.dispatch("toggle"));

      // Update the nodes…
      const node = gNode.selectAll("g")
        .data(nodes, d => d.id || (d.id = ++i));

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter()
        .append("g")
        .attr("transform", d => `translate(${direction(source)})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", toggle);

      // Add html for people's details to be displayed
      nodeEnter.append('foreignObject')
        .attr('class', 'frame')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 0)
        .attr('height', 0)
        .html((d) => {
          const person = d.data.data;
          return `${PersonBox(person)}`;
        });

      // Add 'has children' indicator circles
      nodeEnter.append('circle')
        .attr('class', 'hasChildren')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', d => d._children ? 4 : 0);

      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter)
        .transition(transition)
        .attr("transform", d => `translate(${direction(d)})`);

      // Update the frames
      nodeUpdate.select('foreignObject.frame')
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1)
        .attr('x', -(nodeSize.width / 2))
        .attr('y', -(nodeSize.height / 2))
        .attr('width', nodeSize.width)
        .attr('height', nodeSize.height);

      // Update the 'has children' indicator circles
      nodeUpdate.select('circle.hasChildren')
        .attr('cx', (nodeSize.width / 2))
        .attr('cy', 0)
        .attr('r', d => d._children ? 4 : 0)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

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
          return DynamicTree.transitionElbow({ source: o, target: o });
        });

      // Transition links to their new position.
      link.merge(linkEnter)
        .transition(transition)
        .attr("d", d => DynamicTree.elbow(d, nodeSize));

      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = { x: source.x, y: source.y };
          return DynamicTree.transitionElbow({ source: o, target: o });
        });

      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Toggle children
    function toggle(event, d) {
      DynamicTree.updateNode(update, d);
    }
  }, [ treeRoot, width, height, xDomain, yDomain ])


  return <g ref={containerRef} />
}
