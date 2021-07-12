function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

let jsonData;

readTextFile("./json/data.json", function(text){
    let data = JSON.parse(text)
        htmlString = '',
        total = 0;
    
    drawGraph(data);

    const totalEl = document.getElementById('total');
    const datesList = document.getElementById('dates');
    
    for (let x in data) {
        htmlString += '<li>'
        htmlString += 'Date: ' + data[x].date;
        htmlString += ' - Value: ' + data[x].value;
        htmlString += '</li>';
        total += parseInt(data[x].value);
    }

    totalEl.innerHTML = "Total: " + total;
    datesList.innerHTML = htmlString;
});



// const data = [
// 	{
// 		"date": "26 June, 2021, 22:37:16",
// 		"value": 2
// 	}, {
// 		"date": "26 June, 2021, 22:37:39",
// 		"value": 3
// 	}, {
// 		"date": "04 July, 2021, 22:14:02",
// 		"value": 6
// 	}, {
// 		"date": "08 July, 2021, 00:10:49",
// 		"value": 7
// 	}
// ]
let drawGraph = (jsonData) => {
    const width = 1400;
    const height = 450;
    const margin = { top: 50, bottom: 50, left: 50, right: 50 };
    
    const svg = d3.select('body')
      .append('svg')
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr("viewBox", [0, 0, width, height]);
    
    const x = d3.scaleBand()
      .domain(d3.range(jsonData.length))
      .range([margin.left, width - margin.right])
      .padding(0.1)
    
    const y = d3.scaleLinear()
      .domain([0, 10])
      .range([height - margin.bottom, margin.top])
    
    svg
      .append("g")
      .attr("fill", 'royalblue')
      .selectAll("rect")
      .data(jsonData.sort((a, b) => d3.descending(a.value, b.value)))
      .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.value))
        .attr('title', (d) => d.value)
        .attr("class", "rect")
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth());
    
    function yAxis(g) {
      g.attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, jsonData.format))
        .attr("font-size", '20px')
    }
    
    function xAxis(g) {
      g.attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => jsonData[i].date))
        .attr("font-size", '20px')
    }
    
    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    svg.node();
}
  




// d3.json("./json/data.json", function(data) {
//     let canvas = d3.select('body').append('svg').attr("width", 500).attr('height', 400);
//     canvas.selectAll('rect').data(data).enter()
//         .append('rect')
//         .attr('width', function(d) { return d.value * 40; })
//         .attr('height', 35)
//         .attr('y', function(d, i) { i * 5; })
//         .attr('fill', 'blue');

//     canvas.selectAll('text').data(data).enter()
//         .append('text')
//         .attr('fill', 'white')
//         .attr('y', function(d, i) { return i * 50 + 24; })
//         .text(function(d) { return d.date; })
// });


/*
function drawHistogram(data){
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#dataVizContainer")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {
    // d3.json("./json/data.json", function(data) {
        // X axis: scale and draw:
        var x = d3.scaleLinear()
            .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // set the parameters for the histogram
        var histogram = d3.histogram()
            .value(function(d) { return d.price; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(70)); // then the numbers of bins

        // And apply this function to data to get the bins
        var bins = histogram(data);

        // Y axis: scale and draw:
        var y = d3.scaleLinear()
            .range([height, 0]);
            y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        svg.append("g")
            .call(d3.axisLeft(y));

        // append the bar rectangles to the svg element
        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "#69b3a2")

    // }
    // );
}*/