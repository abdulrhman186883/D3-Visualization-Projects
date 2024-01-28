import * as d3 from 'd3';
import { lineChart } from "./linechart.js";
import { loadMoviesDataset } from "./src/movies.js";
import { movieFranchises } from "./src/franchises.js";
import { icicle } from "./icicle.js";

const width = 1000;
const height = 600;

// Create the SVG element
const svg = d3.select("svg#linechart")
  .attr("width", width)
  .attr("height", height);

d3.csv("/data/boxoffice.csv", d3.autoType).then((data) => {


  

  





 
  lineChart({
    svg: svg,
    width: width,
    data: data,
    attributeX: "ReleaseYear",
    attributeY: "BoxOfficeRevenue",
    
  });





  
});




loadMoviesDataset().then((movies) => {
  const franchises = movieFranchises(movies);
  console.log(franchises);
  const color = d3
    .scaleOrdinal(d3.schemeTableau10)
    .domain(new Set(franchises.children, (d) => d.data.name));

  icicle({
    svg: d3.select("svg#icicle"),
    data: franchises,
    color: color,
  });

});
