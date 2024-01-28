import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = await d3.csv("2018_Central_Park_Squirrel_Census.csv", d3.autoType);

const attributes = [
    {name: "X", type:"quantitative", range:[]},
    {name: "Y", type:"quantitative", range:[]},
    {name: "Unique Squirrel ID", type:"ID"},
    {name: "Hectare", type:"ID"},
    {name: "Shift", type:"ordinal", range:["AM", "PM"]},
    {name: "Date", type:"quantitative", range:[]},
    {name: "Hectare Squirrel Number", type:"quantitative", range:[]},
    {name: "Age", type:"categorical", range:[]},
    {name: "Primary Fur Color", type:"categorical", range:[]},
    {name: "Highlight Fur Color", type:"categorical", range:[]},
    {name: "Combination of Primary and Highlight Color", type:"mixture"},
    {name: "Color notes", type:"string"},
    {name: "Location", type:"categorical", range:[]},
    {name: "Above Ground Sighter Measurement", type:"quantitative", range:[]},
    {name: "Specific Location", type:"string"},
    {name: "Running", type:"categorical", range:["true", "false"]},
    {name: "Chasing", type:"categorical", range:["true", "false"]},
    {name: "Climbing", type:"categorical", range:["true", "false"]},
    {name: "Eating", type:"categorical", range:["true", "false"]},
    {name: "Foraging", type:"categorical", range:["true", "false"]},
    {name: "Other Activities", type:"string"},
    {name: "Kuks", type:"categorical", range:["true", "false"]},
    {name: "Quaas", type:"categorical", range:["true", "false"]},
    {name: "Moans", type:"categorical", range:["true", "false"]},
    {name: "Tail twitches", type:"categorical", range:["true", "false"]},
    {name: "Approaches", type:"categorical", range:["true", "false"]},
    {name: "Indifferent", type:"categorical", range:["true", "false"]},
    {name: "Runs from", type:"categorical", range:["true", "false"]},
    {name: "Other Interactions", type:"string"},
    {name: "Lat/Long", type:"mixture"},
]

attributes.forEach(attribute => {
    if(attribute.type == "quantitative") {
        attribute.range = d3.extent(data.map(d => d[attribute.name]).filter(d => Number.isFinite(d)));
    } else if((attribute.type == "categorical" || attribute.type == "ordinal") && attribute.range.length == 0) {
        attribute.range = [... new Set(data.map(d => d[attribute.name]))];
    }
})
console.log(attributes);

d3.select("table#attrTypes")
.selectAll("tr.data")
.data(attributes)
.join("tr")
.attr("class", "data")
.selectAll("td")
.data(d => {
    let range = "";
    if(d.type == "quantitative"){
        range = d.range.join(" - ");
    } else if(d.type == "categorical"){
        range = d.range.join(" | ");
    } else if (d.type == "ordinal") {
        range = d.range.join(" > ");
    }
    return [d.name, d.type, range]})
.join("td")
.text(d => d);