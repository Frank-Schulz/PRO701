import React from 'react'

export default function ForceChart() {
  var width = 1000,
    height = 800;

  var links = data.links,
    nodes = data.nodes;
  var labels = d3.select(".labels");
  var container = d3.select(".container");

  var svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#333");

  var forceSim = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink().links(links).strength(1))
    .force("charge", d3.forceManyBody().strength(-0.75))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(5))
    .on("tick", ticked);

  var link = svg
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link");

  var node = container
    .select(".flags")
    .selectAll("img")
    .data(nodes)
    .enter()
    .append("span")
    .attr("class", (d) => "flag flag-" + d.code)
    .style("transform", "scale(0.5)")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  var linkIndex = {};
  links.forEach(function (d) {
    linkIndex[ d.source.index + "," + d.target.index ] = 1;
  });

  function borders(a, b) {
    return (
      linkIndex[ a.index + "," + b.index ] || linkIndex[ b.index + "," + a.index ]
    );
  }

  var bordering = d3
    .select("body")
    .append("div")
    .style("position", "fixed")
    .style("top", 0)
    .style("left", 0)
    .style("padding", "5px")
    .style("box-shadow", "1px 1px 1px 1px #222")
    .style("color", "#999")
    .style("background-color", "#fff")
    .style("opacity", 0)
    .style("transition", "all 500ms ease-out 0ms");

  node
    .on("mouseover", function (d) {
      var details = "";
      details +=
        '<img class="flag flag-' +
        d.code +
        '"/><div class="country-label main">' +
        d.country +
        "</div>";

      node.style("transform", function (o) {
        if (borders(d, o)) {
          details +=
            '<img class="flag flag-' +
            o.code +
            '"/><div class="country-label">' +
            o.country +
            "</div>";
          return "scale(0.8)";
        } else {
          return "scale(0.35)";
        }
      });

      link.classed("link-active", function (o) {
        return o.source === d || o.target === d ? true : false;
      });

      d3.select(this).style("transform", "scale(1.1)");

      bordering.html(details).style("opacity", 1);
    })
    .on("mouseout", function (d) {
      bordering.style("opacity", 0);
      link.classed("link-active", false);
      node.style("transform", "scale(0.5)");
    });

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    node
      .style("left", (d) => d.x - 16 + "px")
      .style("top", (d) => d.y - 16 + "px");
  }

  function dragstarted(d) {
    if (!d3.event.active) {
      forceSim.alphaTarget(0.05).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) {
      forceSim.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }
  return (
    <div>ForceChart</div>
  )
}
