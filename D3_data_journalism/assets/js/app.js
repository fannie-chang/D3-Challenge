var svgWidth = 960;
var svgHeight = 550;

var margin = {
	top:20,
	right:40,
	bottom: 80,
	left:100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart
// and shift the latter by left and top margins

var svg = d3.select("#scatter")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight )
	

// Append an SVG group
var chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);


//Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {
	//Parse Data/Cast as numbers
	// ==============================
	censusData.forEach(function(data) {
		data.healthcare = +data.healthcare;
		data.poverty = +data.poverty;
		//console.log(data)
		
	});

	// Create scale functions
	// ==============================

const xLinearScale = d3.scaleLinear()
		.domain(d3.extent(censusData, d => d.poverty))
		.range([0, width])
		.nice();

const yLinearScale = d3.scaleLinear()
		.domain([0, d3.max(censusData, d => d.healthcare)])
		.range([height, 0])
		.nice();

	
	
	// Create axis functions
	// ==============================
const bottomAxis = d3.axisBottom(xLinearScale);
const	 leftAxis = d3.axisLeft(yLinearScale);

	
	// Append Axes to the chart
	// ==============================
	chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	chartGroup.append("g")
		.call(leftAxis);

	
	// Create Circles
	// ==============================
	var circlesGroup = chartGroup.selectAll("circle")
		.data(censusData)
		.enter()
		.append("circle")
		.attr("cx" , d => xLinearScale(d.poverty))
		.attr("cy", d => yLinearScale(d.healthcare))
		.attr("r", "15")
		.attr("fill" , "lightblue")
		.classed("stateCircle", true)
		.attr("opacity" , "0.75")
		
		    
 // Crate State Abbr inside the circle
 var circleText = chartGroup.append("g")
 	.selectAll('text')
 	.data(censusData)
 	.enter()
 	.append("text")
 	.text(d => d.abbr)
 	.attr("x" , d => xLinearScale(d.poverty))
	.attr("y", d => yLinearScale(d.healthcare))
	.classed(".stateText" , true)
	.attr("font-family", "sans-serif")
	.attr("fill" , "white")
	.attr("font-size", "10px")
	.classed("stateText", true)
	.attr("alignment-baseline" , "central")
	.attr("font-weight" , "bold");
	
    				
		

	// Initialize tool tip
	// ==============================
	var toolTip = d3.tip()
		.attr("class", "tooltip")
		.offset([80, -60])
		.html(function(d) {
          return (`<strong>${d.state}<br>Poverty:${d.poverty}%<strong>`);
          
        });

	// Create tooltip in the chart
	// ==============================
	chartGroup.call(toolTip);

	// Create event listeners to display and hide the tooltip
	// ==========================================================
	circlesGroup.on("mouseover", function(data){
		toolTip.show(data, this);
	})

	// onmouseout event
	.on("mouseout", function(data) {
		toolTip.hide(data);
	});

	

	// Create axes labels
	chartGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left +40)
		.attr("x", 0 - (height /2))
		.attr("dy", "1em")
		.attr("class", "axisText")
		.style("font-weight" , "bold")
		.attr("text-anchor", "middle")
		.text("Lacks Healthcare (%)");

	chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .style("font-weight" , "bold")
      .attr("text-anchor", "middle")
      .text("In Poverty (%)");

  d3.select("article")


  }).catch(function(error) {
    console.log(error);
  });




