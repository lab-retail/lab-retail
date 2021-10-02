// console.log("dataset lenght:" + dataset.length);

/**
 * Main function to init all graphics and tables
 * Iterate through the dataset
 */
let init = (dataset) => {
    
    let mainElement = document.getElementsByTagName('main')[0],
        oneDayOfData,
        sectionElement,
        dateTitleElement,
        nivelElement,
        totalElement,
        idElement,
        pieChartID,
        pieChartElement,
        barChartID,
        barChartElement;

    // color for pieChart and barChart
    let colorRange = ['#FFA500','#0000FF', '#3FF02B', '#FAF63F']; // orange, blue, green, yellow

    showMainTable(dataset.slice(0, 5));

    for (let x in dataset) {
        oneDayOfData = dataset[x];
        sectionElement = document.createElement("section");
        dateTitleElement = document.createElement("h2");
        nivelElement = document.createElement("h2");
        totalElement = document.createElement("h2");
        idElement = document.createElement("h2");
        
        dateTitleElement.innerHTML = oneDayOfData.date;
        nivelElement.innerHTML = "Most Visited Level: " + oneDayOfData.nivel;
        totalElement.innerHTML = "Total: " + oneDayOfData.todos;
        idElement.innerHTML = "ID: " + oneDayOfData.id;

        // Prepare data for Dount Chart With Text
        const dataArrayforPieChart = [
            {
                "value" : oneDayOfData.prodW
            },
            {
                "value" : oneDayOfData.prodX
            },
            {
                "value" : oneDayOfData.prodY
            },
            {
                "value" : oneDayOfData.prodZ
            }
        ];
        
        pieChartID = 'pieChartID' + x;
        pieChartElement = document.createElement('div');
        pieChartElement.id = pieChartID;
        pieChartElement.classList.add('chartContainer', 'pieChartContainer');

        // Prepare data for Bar Chart
        const dataForBarChart = [
            {
                "productName": "ProdW",
                "value": oneDayOfData.prodW
            },
            {
                "productName": "ProdX",
                "value": oneDayOfData.prodX
            },
            {
                "productName": "ProdY",
                "value": oneDayOfData.prodY
            },
            {
                "productName": "ProdZ",
                "value": oneDayOfData.prodZ
            }
        ];

        barChartID = 'barChartID' + x;
        barChartElement = document.createElement('div');
        barChartElement.id = barChartID;
        barChartElement.classList.add('chartContainer');

        // add all elements to section element
        sectionElement.append(dateTitleElement);
        sectionElement.append(nivelElement);
        sectionElement.append(totalElement);
        sectionElement.append(idElement);
        sectionElement.append(pieChartElement);
        sectionElement.append(barChartElement);
        
        mainElement.append(sectionElement);

        // once chart container Elements are added, add Charts
        showBarChart(dataForBarChart, barChartID, colorRange);
        showDonutChartWithText(dataArrayforPieChart, pieChartID, colorRange);
    }
}

/**
 * Show Main Table 
 */
let showMainTable = (dataArray) => {
    let htmlString = '',
    total = 0;
    nivel = 0;
    
    const totalEl = document.getElementById('total');
    const mainTable = document.getElementById('mainTable');

    for (let x in dataArray) {
        htmlString += '<div class="item">'
        htmlString += dataArray[x].date;
        htmlString += '</div>';
        htmlString += '<div class="item">'
        htmlString += dataArray[x].prodW
        htmlString += '</div>';
        htmlString += '<div class="item">'
        htmlString += dataArray[x].prodX
        htmlString += '</div>';
        htmlString += '<div class="item">'
        htmlString += dataArray[x].prodY
        htmlString += '</div>';
        htmlString += '<div class="item">'
        htmlString += dataArray[x].prodZ
        htmlString += '</div>';
        total += parseInt(dataArray[x].todos);
    }
    
    totalEl.innerHTML = total;
    mainTable.innerHTML += htmlString;
}

/**
 * Show Donut Chart
 */
let showDonutChartWithText = (dataArray, elementID, colorRange) => {
    let pie=d3.pie()
            .value(function(d){
                return d.value
            })
            .sort(null)
            .padAngle(.03);

    let w=300,h=300,
        outerRadius=w/2,
        innerRadius=80;        

    let color = d3.scaleOrdinal(colorRange);

    let arc=d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);

    let svg=d3.select('#' + elementID)
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
                return color(d.data.value);
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
                return d.data.value;
            })
            .style('fill','#000')
            // .style('font-size','3vh');
            .style('font-size', adaptLabelFontSize);
    
    function adaptLabelFontSize() {
        // default mobile first font-size
        let fontSize = '3.5vw';
        if (window.innerWidth > 550) {
            fontSize = '1.2vw';
        }
        return fontSize;
    }
        

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

/**
 * Show Bar Chart 
 */
let showBarChart = (dataArray, elementID, colorRange) => {
    const maxAmount = Math.max(parseInt(dataArray[0].value), parseInt(dataArray[1].value), parseInt(dataArray[2].value), parseInt(dataArray[3].value));
    const width = 500;
    const height = 400;
    const margin = { top: 50, bottom: 50, left: 50, right: 50 };

    const svg = d3.select('#' + elementID)
        .append('svg')
        .attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom)
        .attr("viewBox", [0, 0, width, height]);

    const x = d3.scaleBand()
        .domain(d3.range(dataArray.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    const y = d3.scaleLinear()
        .domain([0, maxAmount])
        .range([height - margin.bottom, margin.top])

    let color = d3.scaleOrdinal(colorRange);
    
    svg
        .append("g")
        .selectAll("rect")
        // .data(dataArray.sort((a, b) => d3.descending(a.value, b.value)))
        .data(dataArray)
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.value))
        .attr('title', (d) => d.value)
        .attr("class", "rect")
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth())
        .attr("fill",function(d,i){
            return color(d.value);
        });

    function yAxis(g) {
        g.attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, dataArray.value))
        .attr("font-size", '20px')
    }

    function xAxis(g) {
        g.attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => dataArray[i].productName))
        .attr("font-size", '20px')
    }

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    svg.node();
}

//-------------------------------------------
// init all functions (pageLoad)
init(dataset);