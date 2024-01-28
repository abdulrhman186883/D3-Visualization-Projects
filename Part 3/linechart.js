import * as d3 from "d3";
import { bigMoneyFormat, shortenText } from "./src/utils.js";

export function lineChart({
  svg,
  data,
  width = 700,
  height = 1000,
  margin = { top: 30, right: 120, bottom: 30, left: 40 },
}) {
  // setup the viewBox and font for the SVG
  svg.attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif");

  const attributeX = "day"; 
  const attributeY = "totalGross"; 
  

//Create scales for the x and y axes using d3.scaleLinear()
  const scaleX = d3
  .scaleLinear()
  .domain([d3.min(data, (d) => d[attributeX]), d3.max(data, (d) => d[attributeX])])
  .range([margin.left, width - margin.right]);

  const scaleY = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d[attributeY])])
  .range([height - margin.bottom, margin.top]);


  // group the data by movie title
  const movies = d3
    .groups(data, (d) => d.title)
    .map(([key, values]) => ({ key, values }));

  console.log(movies);


  //Draw the x-axis using d3.axisBottom()
  svg
  .append("g")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(d3.axisBottom(scaleX))
  .append("text")
  .attr("x", width - margin.right)
  .attr("y", -10)
  .attr("fill", "#362FD9")
  .attr("text-anchor", "end")
  .text(attributeX);

//Draw the y-axis using d3.axisLeft()
  svg
  .append("g")
  .attr("transform", `translate(${margin.left}, 0)`)
  .call(d3.axisLeft(scaleY))
  .append("text")
  .attr("x", 2)
  .attr("y", margin.top-20)
  .attr("fill", "black")
  .attr("text-anchor", "start")
  .text(attributeY);


 
  const colorScale = d3.scaleOrdinal()
  .domain(movies.map((movie) => movie.key))
  .range(["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#800000", "#008000", "#000080", "#808000"]);
 

//Define a line generator
  const line = d3
  .line()
  .x((d) => scaleX(d[attributeX]))
  .y((d) => scaleY(d[attributeY]));

  // setup a group node for each time series
  const series = svg
    .append("g")
    .style("font", "bold 10px sans-serif")
    .selectAll("g")
    .data(movies)
    .join("g");


  //Append path elements for each movie's line using the line generator. Set the line's color based on the movie's title.
  series
  .append("path")
  .attr("fill", "none")
  .attr("stroke", (d) => colorScale(d.key))
  .attr("stroke-width", 2)
  .attr("d", (d) => line(d.values));

  //Add labels for each movie's line to the right of the plot at the last position of the line.

  // labes based on the graph line color 
    series
    .append("text")
    .attr("transform", (d) => { 
      const lastPoint = d.values[d.values.length - 1];
      return `translate(${scaleX(lastPoint[attributeX]) + 5}, ${scaleY(lastPoint[attributeY])})`;
    })
    .attr("dy", "0.35em")
    .style("font-size", "10px")
    .style("fill", (d) => colorScale(d.key))
    .text((d) => d.key);
  
   

  // Optional brushing task start here

  // Uncomment this part below to start your brushing task
  // Hint: this will create the total gross difference label (by default, the last data point) above your movie title label

 // to add above the text the values 
  series
    .append("text")
    .classed("totalGrossDiff", true)
    .datum((d) => ({
      key: d.key,
      value: d.values[d.values.length - 1][attributeY],
    }))
    .attr("fill", "none")
    .attr("stroke-width", 1)
    .attr("x", scaleX.range()[1] + 3)
    .attr("y", (d) => scaleY(d.value) - 15)
    .attr("dy", "0.35em")
    .text((d) => bigMoneyFormat(d.value))
    .attr("fill", (d) => colorScale(d.key))
  


//added code 
// Define the brush
const linechartBrush = d3.brushX()
.extent([[0, 0], [width, height]])
.on("brush", brushed);

// Call the brush
svg.append("g")
.attr("class", "brush")
.call(linechartBrush);



  // added part !! 
function brushed(brushEvent) {
  const selection = brushEvent.selection;

  // Map container for the total gross difference label for each movie
  const updateLabel = new Map();

  if (selection) {
    // find the brush point on the x-axis at the beginning and end of the brush
    const minX = scaleX.invert(selection[0]);
    const maxX = scaleX.invert(selection[1]);

    // find the line for all movies
    const lines = series.selectAll("path");

    // find the point on the line for each movie at the beginning and end of the brush
    lines.each(function (d) {
      const path = d3.select(this);
      const moviesLine = path.datum().values;

      const startIndex = d3.bisector((d) => d[attributeX]).left(moviesLine, minX);
      const endIndex = d3.bisector((d) => d[attributeX]).left(moviesLine, maxX);

      const brushStartPoint = moviesLine[startIndex];
      const brushEndPoint = moviesLine[endIndex];

      // use interpolateLine function to find the totalGross values for each movie at both brush points
      const startTotalGross = interpolateLine(moviesLine, startIndex, minX);
      const endTotalGross = interpolateLine(moviesLine, endIndex, maxX);

      // find the total gross difference between the beginning and end of the brush
      const grossDifference = endTotalGross - startTotalGross;

      // update the total gross difference label for each movie
      updateLabel.set(d.key, grossDifference);
    });

    if (updateLabel.size > 0) {
      series
        .selectAll("text.totalGrossDiff")
        .text((d) => bigMoneyFormat(updateLabel.get(d.key)))
        .attr("fill", (d) => colorScale(d.key));
    }
  }
}


  function interpolateLine(moviesLine, i, brushPointX) {
    if (moviesLine == undefined || i == undefined || brushPointX == undefined) {
      return 0;
    }

    else if (attributeX in moviesLine[i] && attributeY in moviesLine[i] &&
      typeof moviesLine[i][attributeX] == "number" && typeof moviesLine[i][attributeY] == "number") {
      const a = [moviesLine[i][attributeX], moviesLine[i][attributeY]];

      let b;
      if (moviesLine[i + 1] == undefined || moviesLine[i + 1][attributeX] == undefined || moviesLine[i + 1][attributeY] == undefined) {
        b = [moviesLine[moviesLine.length - 1][attributeX], moviesLine[moviesLine.length - 1][attributeY]];
      } else {
        b = [moviesLine[i + 1][attributeX], moviesLine[i + 1][attributeY]];
      }

      if (a[0] == b[0] && b[1] == a[1]) {
        return b[1];
      }

      const m = (b[1] - a[1]) / (b[0] - a[0]);
      return m * (brushPointX - a[0]) + a[1];
    }
    return 0;
  }



}
