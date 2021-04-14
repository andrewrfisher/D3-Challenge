//create svg canvas
var svgWidth = 960;
var svgHeight = 500;

//define margins
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("trend_data.csv").then(function(trendData1) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    trendData1.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      console.log(data.healthcare);
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([7.5, d3.max(trendData1, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(trendData1, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(trendData1)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .attr("fill", "#0EA0B1")
    .attr("opacity", "0.8");
    // .text(function(abbr) {
    //     return abbr.abbr;
    //   });

     //append Initial Text and use abbr
     var textGroup = chartGroup.selectAll('.stateText')
     .data(trendData1)
     .enter()
     .append('text')
     .classed('stateText', true)
     .attr("x", d => xLinearScale(d.poverty))
     .attr("y", d => yLinearScale(d.healthcare))
     .attr('dy', 3)
     .attr('font-size', '10px')
     .text(function(d){return d.abbr});

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .style("color", "white")
      .style("background-color", "#0EA0B1")
      .style("padding", "10px")
      .html(function(d) {
        return (`${d.state}<br>Poverty %: ${d.poverty} % <br>Healthcare %: ${d.healthcare} %`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this)
      toolTip.style("stroke", "black")
        .style("opacity", "0.8");
    })
      // on mouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data)
        toolTip.style("stroke", "none")
            .style("opacity", "0.8");

      });

    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
      .attr("class", "axisText")
      .text("State's Healthcare Percentage");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("transform",
          "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
      .attr("class", "axisText")
      .text("State's Poverty Percentage");
  }).catch(function(error) {
    console.log(error);
  });



// Second Scatter
//==============================
