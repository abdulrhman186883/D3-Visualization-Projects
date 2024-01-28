import * as d3 from "d3";
import { bigMoneyFormat, shortenText } from "./src/utils.js";

export function visualizeData({
  svg,
  data,
  width = 1000,
  height = 600,
  color
}) {
  svg.attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif");
  svg.selectAll("*").remove();

  // Prepare the hierarchy using d3.hierarchy
  const hierarchy = d3.hierarchy(data)
    .sum((d) => d.revenue)
    .sort((a, b) => b.value - a.value);

  // Check if the hierarchy is suitable for treemap or icicle layout based on the height and width
  const isTreemap = width >= height;

  if (isTreemap) {
    drawTreemap(hierarchy);
  } else {
    drawIcicle(hierarchy, color);
  }

  function drawTreemap(hierarchy) {
    const root = d3.treemap()
      .tile(d3.treemapSliceDice)
      .size([width, height])
      .padding(1)
      (hierarchy);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    leaf.append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("fill", (d) => colorScale(d.data.category));

    const text = leaf.filter((d) => d.x1 - d.x0 > 30 && d.y1 - d.y0 > 10)
      .append("text")
      .attr("x", 3)
      .attr("y", 12)
      .attr("dy", ".35em")
      .attr("font-size", fontSize)
      .text((d) => d.data.name);

    text.append("tspan")
      .attr("font-weight", "bold")
      .text((d) => d.data.name);

    text.append("tspan")
      .attr("fill-opacity", 0.7)
      .text((d) => ` - ${bigMoneyFormat(d.value)}`);
  }

  function drawIcicle(hierarchy, color) {
    const root = d3.partition()
      .size([height, width])
      .padding(0)
      (hierarchy);

    const maxDepth = d3.max(root.descendants(), d => d.depth);

    const scaleX = d3.scaleLinear()
      .domain([0, maxDepth])
      .range([0, maxDepth]);

    const node = svg.selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.y0},${d.x0})`);

    node.append("rect")
      .attr("width", (d) => d.y1 - d.y0)
      .attr("height", (d) => d.x1 - d.x0)
      .attr("fill", color)
      .attr("class", "node-rectangles");

    const minFontSize = 6;

    const text = node.append("text")
      .attr("x", 4)
      .attr("y", 13)
      .attr("fill-opacity", (d) => fontSize(d) >= minFontSize ? 1 : 0)
      .style("font-size", (d) => fontSize(d))
      .text((d) => {
        if (d.depth === root.height) {
          return `[Div into]`;
        } else {
          return ` ${shortenText(d.data.name)}`;
        }
      });

    text.filter((d) => fontSize(d) >= minFontSize)
      .append("tspan")
      .attr("fill-opacity", 1)
      .text((d) => ` (${bigMoneyFormat(d.value)})`);

    function fontSize(d) {
      return Math.min(12, Math.max(minFontSize, scaleX(d.y1) - scaleX(d.y0) - 2));
    }
  }
}
