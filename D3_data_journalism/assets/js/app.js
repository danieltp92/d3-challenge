
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

var axisX = 'smoker';
var axisY = 'age';
