// Task 1 your solution here

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";



d3.csv("./spotify_Music_Data.csv").then(function (data) {
  console.log(data);

  var filteredData = data
    .filter(function (d) {
      return +d.year >= 2010 && d.artist == "Rihanna" ;
    })
    .map(function (d) {
      return {
        artist: d.artist,
        energy: +d.energy,
        danceability: +d.danceability,
        valence: +d.valence,
      };
    });

  console.log(filteredData);

  // Parent HTML element that contains the labels and the plots
  const parent = d3.select("#visualization");

  // Sizes of the plots
  const width = 800;
  const height = 800;

  // Set of selected items within the brush
  const selectedItems = new Set();



// Define categorical attribute
const categoricalAttribute = "year"; 
// Define numerics attribute
  const numerics = ["energy", "danceability", "valence"];

// create the color scale
const colorScale = d3.scaleOrdinal().domain(numerics).range(["#FFA500", "#00FF00", "#FF00FF"]);
//color need to be different !


createLabel();
createScatterPlotMatrix(width, height);
createHorizontalParallelCoordinates(width, height / 2);




  // Task 2




  function createLabel() {
    
    const labelContainer = parent.append("div")
    .style("display", "flex")
    .style("justify-content", "space-between");

  const labelNames = ["energy", "danceability", "valence"];
  const labelColors = ["#FFA500", "#00FF00", "#FF00FF"];

  for (let i = 0; i < labelNames.length; i++) {
    const label = labelContainer.append("div")
      .style("display", "flex")
      .style("align-items", "center");

    label.append("div")
      .style("width", "10px")
      .style("height", "10px")
      .style("background-color", labelColors[i])
      .style("margin-right", "5px");

    label.append("div")
      .text(labelNames[i])
      .style("font-size", "14px")
      .style("font-weight", "bold");
  }


    // map the energy values to colors using the color scale
    const colorMappedData = filteredData.map(function (d) {
      return {
        artist: d.artist,
        energy: d.energy,
        danceability: d.danceability,
        valence: d.valence,
        color: colorScale(d.energy),
      };
    });
    console.log(colorMappedData);
  }

    

  /**
   * Create Scatter Plot Matrix with the given width and height. The contents of each cell
   * in this matrix is defined by the scatterPlot() function.
   *
   * @param {integer} width
   * @param {integer} height
   */
  function createScatterPlotMatrix(width, height) {
    const margin = { top: 10, left: 20, bottom: 20, right: 10 };
    const grid_height = height / numerics.length;
    const grid_width = width / numerics.length;
    const fontSize = 10;

    const svg = parent.append("svg").attr("viewBox", [0, 0, width, height]);

    const scatterplot_matrix = svg
      .selectAll("g.scatterplot")
      .data(d3.cross(numerics, numerics))
      .join("g")
      .attr(
        "transform",
        (d, i) => "translate(" + (i % numerics.length) * grid_width + "," + Math.floor(i / numerics.length) * grid_height + ")"
      );

    scatterplot_matrix.each(function (d) {
      // each pair from cross combination
      const g = d3.select(this);

      scatterPlot(d[0], d[1], g, grid_width, grid_height, margin);

      const labelXPosition = (grid_width - margin.right - margin.left) / 2 + margin.left;
      const labelYPosition = 10;

      // label the same attribute axis
      if (d[0] == d[1]) {
        g.append("text")
          .text(d[0])
          .attr("transform", "translate(" + labelXPosition + "," + labelYPosition + ")")
          .style("text-anchor", "middle")
          .style("fill", "black")
          .style("font-size", fontSize);
      }
    });
  }

  /**
   * Task 3
   * @param {string} labelX
   * @param {string} labelY
   * @param {nodeElement} scatterplotCell
   * @param {integer} width
   * @param {integer} height
   * @param {Object} margin
   */
  function scatterPlot(labelX, labelY, scatterplotCell, width, height, margin) {
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, (d) => d.danceability))
      .range([margin.left, width - margin.right]);
    scatterplotCell.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale));

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, (d) => d.valence))
      .range([height - margin.bottom, margin.top]);
    scatterplotCell.append("g").call(d3.axisLeft(yScale));

    const colorScale = d3.scaleOrdinal().domain(numerics).range(["#FFA500", "#00FF00", "#FF00FF"]);

    scatterplotCell
      .selectAll("circle")
      .data(filteredData)
      .join("circle")
      .attr("cx", d => xScale(+d[labelX]))
      .attr("cy", d => yScale(+d[labelY]))
      .attr("r", 5)
      .style("fill", (d) => colorScale(d.energy))
      .style("opacity", 0.7)
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 1);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).style("opacity", 0.7);
      });


      const brush = d3.brush()
    .extent([
      [margin.left, margin.top],
      [width - margin.right, height - margin.bottom]
    ])
    .on("end", brushed);

    scatterplotCell.call(brush);

    function brushed(brushEvent) {
      const selection = brushEvent.selection;
    
      const selectedPoints = scatterplotCell.selectAll("circle")
        .attr("opacity", d => {
          const cx = xScale(+d[labelX]);
          const cy = yScale(+d[labelY]);
          return isInsideBrush(selection, cx, cy) ? 1 : 0.3;
        });
    
      const selectedData = selectedPoints.data().map(d => d.id);
      selectedItems.clear();
      selectedData.forEach(d => selectedItems.add(d));
    }
    
    
    // A function that returns TRUE or FALSE according to whether a dot is inside the selection or not
    function isInsideBrush(brush_coords, cx, cy) {
      if (!brush_coords) {
        return false;
      }
    
      const [x0, y0] = brush_coords[0];
      const [x1, y1] = brush_coords[1];
    
      return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
    }
  }


  /**
   * Task 4
   * @param {integer} width
   * @param {integer} height
   */
  function createHorizontalParallelCoordinates(width, height) {
    const margin = { top: 10, left: 20, bottom: 20, right: 10 };



// create the color scale
const colorScale = d3.scaleOrdinal().domain(numerics).range(["#FFA500", "#00FF00", "#FF00FF"]);



    const brushWidth = 10;
    const brush = d3
      .brushY()
      .extent([
        [-brushWidth / 2, margin.top],
        [brushWidth / 2, height - margin.bottom],
      ])
      .on("end", brushed);


//add parent again here 
    const axes = parent
      .append("svg")
      .attr("viewBox", [-30, -30, width, height])
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      

    // Create the scales for each attribute
    var scales = {};
    numerics.forEach(function (attr) {
      scales[attr] = d3
        .scaleLinear()
        .domain(d3.extent(filteredData, function (d) {
          return d[attr];
        }))
        .range([height - margin.bottom, margin.top]);
    });

    // Create the vertical axes
    var axis = d3.axisLeft()
      .tickSize(-width)
      .ticks(25);

    numerics.forEach(function (attr, index) {
      axes.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (index * (width / numerics.length)) + ",0)")
        .call(axis.scale(scales[attr]));

      axes.append("text")
        .attr("class", "axis-label")
        .attr("x", index * (width / numerics.length) + (width / numerics.length) / 2)
        .attr("y", -margin.top / 2)
        .style("text-anchor", "middle")
        .text(attr);
    });

    // Create the polylines
    var line = d3.line()
      .defined(function (d) {
        return !isNaN(d[1]);
      })
      .x(function (d, i) {
        return i * (width / numerics.length);
      })
      .y(function (d) {
        return scales[d[0]](d[1]);
      });

    axes.selectAll("path.line")
      .data(filteredData)
      .enter()
      .append("path")
      .attr("class", "line")
      
      .attr("d", function (d) {
        return line(Object.entries(d).filter(function (entry) {
          return numerics.includes(entry[0]);
        }));
      })
      .style("stroke", function (d) {
        return colorScale(d.energy);
      })
      .style("fill", "none");


    
    axes.append("g")
      .attr("class", "brush")
      .call(brush);



    function brushed(brushEvent, key) {
    

      const selection = brushEvent.selection;
      const attributeName = key[0];
  
      data.forEach(d => {
        const value = +d[attributeName];
        d.selected = isWithinRange(value, attributeName);
      });
      
      const selectedData = data.filter(d => d.selected);
      updateParallelLines(selectedData);
      
      function isWithinRange(value, attributeName) {
        const index = numerics.indexOf(attributeName);
        const xScale = xScales[index];
        const selection = brushEvent.selection;
      
        if (!selection) {
          return false;
        }
      
        const lowerBound = xScale(selection[1]);
        const upperBound = xScale(selection[0]);
      
        return value >= lowerBound && value <= upperBound;
      }
      
      function updateParallelLines(selectedData) {
        svg.selectAll(".parallel-line")
          .data(selectedData)
          .attr("d", d => lineGenerator(numerics.map(attr => +d[attr])));
      }
    }
  }
});