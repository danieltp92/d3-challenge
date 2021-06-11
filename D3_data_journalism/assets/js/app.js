
var svgHeight = 700;
var svgWidth = 1200;
var margin = {
    top: 10,
    bottom: 50,
    right: 20,
    left: 40
}

var height = svgHeight - margin.bottom - margin.top;
var width = svgWidth - margin.left - margin.right;

var scat = d3.select("#scatter").append('div').classed('chart', true);

var svg = scat.append('svg').attr('height', svgHeight).attr('width', svgWidth);

var scatAll = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

var axisY = 'age';
var axisX = 'smoker';

function scaleY(censusData, axisY) {
    let scaleY = d3.scaleLinear().domain([d3.min(censusData, d => d[axisY]) * 0.8,
                                          d3.max(censusData, d => d[axisY]) * 1.2])
                                 .range([height, 0]);
                        
    return scaleY;
}

function scaleX(censusData, axisX) {
    let scalex = d3.scaleLinear().domain([d3.min(censusData, d => d[axisX]) * 0.8,
                                          d3.max(censusData, d => d[axisX]) * 1.2])
                                 .range([height, 0]);
                        
    return scaleX;
}