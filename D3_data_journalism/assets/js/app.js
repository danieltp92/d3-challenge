


let svgWidth = 960;
let svgHeight = 620;
let margin = {
  top: 20, 
  right: 40, 
  bottom: 200,
  left: 100
};

let height = svgHeight - margin.top - margin.bottom;
let width = svgWidth - margin.right - margin.left;

let chart = d3.select('#scatter').append('div').classed('chart', true);

let svg = chart.append('svg').attr('width', svgWidth).attr('height', svgHeight);

let chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

let chosenYAxis = 'smokes';
let chosenXAxis = 'age';

function yScale(censusData, chosenYAxis) { 
    let yLinearScale = d3.scaleLinear().domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8, d3.max(censusData, d => d[chosenYAxis]) * 1.2]).range([height, 0]);
  
    return yLinearScale;
}

function xScale(censusData, chosenXAxis) {
    let xLinearScale = d3.scaleLinear().domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8, d3.max(censusData, d => d[chosenXAxis]) * 1.2]).range([0, width]);

    return xLinearScale;
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition().duration(1500).call(leftAxis);
  
    return yAxis;
}

function renderXAxis(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition().duration(1500).call(bottomAxis);

  return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition().duration(1500).attr('cx', data => newXScale(data[chosenXAxis])).attr('cy', data => newYScale(data[chosenYAxis]))
    
    return circlesGroup;
}

function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition().duration(1500).attr('x', d => newXScale(d[chosenXAxis])).attr('y', d => newYScale(d[chosenYAxis]));

    return textGroup
}

function styleX(value, chosenXAxis) {

    if (chosenXAxis === 'smokes') {
        return `${value}%`;
    }
    
    else if (chosenXAxis === 'poverty') {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}


function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === 'smokes') {
      var xLabel = 'Smoker:';
    }
    
    else if (chosenXAxis === 'obesity'){
      var xLabel = 'Obesity:';
    }
    
    else {
      var xLabel = 'Without Healthcare:';
    }

  if (chosenYAxis ==='age') {
    var yLabel = "Age:"
  }
  else if(chosenYAxis === 'income') {
    var yLabel = 'Income:';
  }
  else{
    var yLabel = 'Poverty:';
  }

  var toolTip = d3.tip().attr('class', 'd3-tip').offset([-8, 0]).html(function(d) {
        
    return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
  });

  circlesGroup.call(toolTip);

  circlesGroup.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

    return circlesGroup;
}

d3.csv('./assets/data/data.csv').then(function(censusData) {

    console.log(censusData);

    censusData.forEach(function(data){
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

 
    
    var yLinearScale = yScale(censusData, chosenYAxis);
    var xLinearScale = xScale(censusData, chosenXAxis);
    var leftAxis = d3.axisLeft(yLinearScale);
    var bottomAxis = d3.axisBottom(xLinearScale);
    

    var yAxis = chartGroup.append('g').classed('y-axis', true).call(leftAxis);
    var xAxis = chartGroup.append('g').classed('x-axis', true).attr('transform', `translate(0, ${height})`).call(bottomAxis);

    var textGroup = chartGroup.selectAll('.stateText')
    .data(censusData)
    .enter()
    .append('text')
    .classed('stateText', true)
    .attr('x', d => xLinearScale(d[chosenXAxis]))
    .attr('y', d => yLinearScale(d[chosenYAxis]))
    .attr('dy', 3)
    .attr('font-size', '25px')
    .text(function(d){return d.abbr});

    
    var circlesGroup = chartGroup.selectAll('circle')
      .data(censusData)
      .enter()
      .append('circle')
      .classed('stateCircle', true)
      .attr('cx', d => xLinearScale(d[chosenXAxis]))
      .attr('cy', d => yLinearScale(d[chosenYAxis]))
      .attr('r', 17)
      .attr('opacity', '.8');

      
    var yLabelsGroup = chartGroup.append('g').attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

    var ageLabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'age')
    .text('Age'); 

    var povertyLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'poverty')
      .text('In Poverty (%)');

    var incomeLabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 60)
    .attr('value', 'income')
    .text('Household Income');
       

    var xLabelsGroup = chartGroup.append('g').attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    

    var obesityLabel = xLabelsGroup.append('text')
        .classed('aText', true)
        .classed('inactive', true)
        .attr('x', 0)
        .attr('y', 0 - 20)
        .attr('dy', '1em')
        .attr('transform', 'rotate(-90)')
        .attr('value', 'obesity')
        .text('Obese (%)');

    var smokesLabel = xLabelsGroup.append('text')
        .classed('aText', true)
        .classed('inactive', true)
        .attr('x', 0)
        .attr('y', 0 - 40)
        .attr('dy', '1em')
        .attr('transform', 'rotate(-90)')
        .attr('value', 'smokes')
        .text('Smoker (%)');

    var healthcareLabel = xLabelsGroup.append('text')
        .classed('aText', true)
        .classed('active', true)
        .attr('x', 0)
        .attr('y', 0 - 60)
        .attr('dy', '1em')
        .attr('transform', 'rotate(-90)')
        .attr('value', 'healthcare')
        .text('Without Healthcare (%)');
      
    
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    yLabelsGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');

            if(value !=chosenYAxis) {

                chosenYAxis = value;
                yLinearScale = yScale(censusData, chosenYAxis);
                yAxis = renderYAxis(yLinearScale, yAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                if (chosenYAxis === 'age') {
                    obesityLabel.classed('active', false).classed('inactive', true);
                    smokesLabel.classed('active', true).classed('inactive', false);
                    healthcareLabel.classed('active', false).classed('inactive', true);
                }
                else if (chosenYAxis === 'poverty') {
                    obesityLabel.classed('active', true).classed('inactive', false);
                    smokesLabel.classed('active', false).classed('inactive', true);
                    healthcareLabel.classed('active', false).classed('inactive', true);
                }
                else {
                    obesityLabel.classed('active', false).classed('inactive', true);
                    smokesLabel.classed('active', false).classed('inactive', true);
                    healthcareLabel.classed('active', true).classed('inactive', false);
                }
            }
        });


    xLabelsGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');

            if (value != chosenXAxis) {

                chosenXAxis = value; 

                xLinearScale = xScale(censusData, chosenXAxis);

                xAxis = renderXAxis(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                if (chosenXAxis === 'smokes') {
                povertyLabel.classed('active', true).classed('inactive', false);
                ageLabel.classed('active', false).classed('inactive', true);
                incomeLabel.classed('active', false).classed('inactive', true);
                }
                else if (chosenXAxis === 'poverty') {
                povertyLabel.classed('active', false).classed('inactive', true);
                ageLabel.classed('active', true).classed('inactive', false);
                incomeLabel.classed('active', false).classed('inactive', true);
                }
                else {
                povertyLabel.classed('active', false).classed('inactive', true);
                ageLabel.classed('active', false).classed('inactive', true);
                incomeLabel.classed('active', true).classed('inactive', false);
                }
            }
        });
        
});
    
    



    
    
  
    
 