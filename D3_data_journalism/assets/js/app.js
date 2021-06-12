
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
var axisX = 'smokes';

function scaleY(allData, axisY) {
    let scaleY = d3.scaleLinear().domain([d3.min(allData, d => d[axisY]) * 0.8,
                                          d3.max(allData, d => d[axisY]) * 1.2])
                                 .range([height, 0]);
                        
    return scaleY;
}

function scaleX(allData, axisX) {
    let scalex = d3.scaleLinear().domain([d3.min(allData, d => d[axisX]) * 0.8,
                                          d3.max(allData, d => d[axisX]) * 1.2])
                                 .range([height, 0]);
                        
    return scaleX;
}

function axisY(scaleY, y) {
    let axis1 = d3.leftAxis(scaleY);

    y.transition().duration(1500).call(axis1);

    return y;
}

function axisX(scaleX, x) {
    let axis2 = d3.bottomAxis(scaleX);

    x.transition().duration(1500).call(axis2);

    return x;
}

function circles(allCircles, scaleY, scaleX, axisY, axisX) {

    allCircles.transition().duration(1500).attr('cy', data => scaleY(data[axisY])).attr('cx', data => scaleX(data[axisX]))

    return allCircles;
}

function text(allText, scaleY, scaleX, axisY, axisX) {

    allText.transition().duration(1500).attr('y', data => scaleY(data[axisY])).attr('x', data => scaleX(data[axisX]))

    return allCircles;
}

function xStyle(value, axisX) {

    if (axisX === 'smoker') {
        return `${value}%`;
    }
    else if (axisX === 'age') {
        return `${value}%`;
    }
    else {
        return `${value}%`;
    }
}

function refreshToolTip(axisY, axisX, circles) {

    if (axisY === 'age') {
        var labelY = 'Age:';
    }
    else if (aixsY === 'poverty') {
        var labelY = 'Poverty:';
    }
    else {
        var labelY = 'Median Income:';
    }

    if (axisX === 'smokes') {
        var labelX = 'Smoker';
    }
    else if (axisX === 'healthcare') {
        var labelX = 'No Healthcare:';
    }
    else {
        var labelX = 'Obesity';
    }

    var toolTip = d3.tip().attr('class', 'd3-tip').offset([-8, 0]).html(function(d) {
        return (`${d.state}<br>${labelY} ${styleY(d[axisY], axisY)}<br>${labelX} ${d[axisX]}%`)
    });

    circles.call(toolTip);

    circles.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

    return circles;
}

d3.csv('./assets/data/data.csv').then(function(allData) {

    console.log(allData);

    allData.forEach((data) => {
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });
})