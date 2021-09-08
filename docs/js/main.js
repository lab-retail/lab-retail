console.log(dataset);

// values and colors Arrays will be used by D3 graphs
// let valuesArray = [];
// let colorsArray = ["#53a1aa", "#c6e4e4", "#dbdcc3", "#d66747", "#782e1f"];
// let colorsArray = ["#53a1aa", "#76AFB7", "#c6e4e4", "#dbdcc3", "#d66747", "#782e1f"];

let showMainTable = () => {
    let htmlString = '',
    total = 0;
    nivel = 0;
    
    const totalEl = document.getElementById('total');
    const mainTable = document.getElementById('mainTable');
    const nivelEl = document.getElementById('nivelMasVisitado');

    for (let x in dataset) {
        htmlString += '<div class="item">'
        htmlString += dataset[x].date;
        htmlString += '</div>';
        htmlString += '<div class="item">'
        htmlString += dataset[x].prodX
        htmlString += '</div>';
        htmlString += '<div class="item">'
        htmlString += dataset[x].prodY
        htmlString += '</div>';
        total += parseInt(dataset[x].todos);
        nivel = parseInt(dataset[x].nivel);
    }
    
    totalEl.innerHTML = total;
    nivelEl.innerHTML = nivel;
    mainTable.innerHTML += htmlString;
}


let showDonutChartWithText = () => {
    // let dataArray = dataset;
    let dataArray = [
        {
            "prodX" : dataset[0].prodX
        },
        {
            "prodX" : dataset[0].prodY
        }
    ]

    let pie=d3.pie()
            .value(function(d){
                // return d.value
                return d.prodX
            })
            .sort(null)
            .padAngle(.03);

    let w=300,h=300;

    let outerRadius=w/2;
    let innerRadius=100;

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let arc=d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);

    let svg=d3.select("#chart")
            .append("svg")
            .attr("width",w)
            .attr("height",h)
            .attr("class", "shadow")
            .append('g')
            .attr("transform",'translate('+w/2+','+h/2+')');

    let path=svg.selectAll('path')
            .data(pie(dataArray))
            .enter()
            .append('path')
            .attr("d",arc)
            .attr("fill",function(d,i){
                return color(d.data.prodX);
            });

    path.transition()
            .duration(1000)
            .attrTween('d', function(d) {
                var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
                return function(t) {
                    return arc(interpolate(t));
                };
            });

    let restOfTheData=function(){
        let text=svg.selectAll('text')
                .data(pie(dataArray))
                .enter()
                .append("text")
                .transition()
                .duration(200)
                .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("dy", ".4em")
                .attr("text-anchor", "middle")
                .text(function(d){
                    // return d.data.value+"%";
                    return d.data.prodX;
                })
                .style('fill','#fff')
                .style('font-size','4vw');

        // let legendRectSize=20;
        // let legendSpacing=7;
        // let legendHeight=legendRectSize+legendSpacing;

        // let legend=svg.selectAll('.legend')
        //         .data(color.domain())
        //         .enter()
        //         .append('g')
        //         .attr('class','legend')
        //         .attr('transform',
        //             function(d,i){
        //                 //Just a calculation for x & y position
        //                 return 'translate(-35,' + ((i*legendHeight)-65) + ')';
        //             });
        // // console.log('color :' + color.domain());
        // legend.append('rect')
        //         .attr('width',legendRectSize)
        //         .attr('height',legendRectSize)
        //         .attr('rx',20,)
        //         .attr('ry',20)
        //         .style({
        //             fill:color,
        //             stroke:color
        //         });

        // legend.append('text')
        //         .attr('x',30)
        //         .attr('y',15)
        //         .text(function(d){
        //             return d;
        //         }).style({
        //             fill:'#929DAF',
        //             'font-size':'14px'
        //         });
    };

    setTimeout(restOfTheData,1000);
}

// init all functions
showMainTable();
// showDonutChart();
showDonutChartWithText();




/**
 * Data for the Donut Chart comes on the valuesArray
 */
 let showDonutChart = () => {
    // set the dimensions and margins of the graph
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width,
    // let width = 450
        height = 450,
        margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#donutChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // set the color scale
    const color = d3.scaleOrdinal()
    .domain(valuesArray)
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])
    .range(colorsArray)

    // Compute the position of each group on the pie:
    const pie = d3.pie().value(function(d) {return d.value; })
    const data_ready = pie(d3.entries(valuesArray))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(100)// This is the size of the donut hole
            .outerRadius(radius)
        )
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
}






/**
 * dataset contains JSON Content from PHP readMail function
 * dataset can be used throughout all functions
 * dataset content format
 * {
 *      dates: 
 *          [
 *              {
 *                  date: DDMMYY, 
 *                  [
 *                       { id: X, value: Y },
 *                       { id: X, value: Y }
 *                  ],
 *              }, 
 *              {
 *                  date: DDMMYY, 
 *                  [
 *                      { id: X, value: Y },
 *                      { id: X, value: Y }
 *                  ],
 *              }    
 *          ]
 * }
 */