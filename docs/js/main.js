// console.log(dataset);

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

    for (let x in dataset) {
        oneDayOfData = dataset[x];
        sectionElement = document.createElement("section");
        dateTitleElement = document.createElement("h2");
        nivelElement = document.createElement("h2");
        totalElement = document.createElement("h2");
        idElement = document.createElement("h2");
        
        dateTitleElement.innerHTML = oneDayOfData.date;
        nivelElement.innerHTML = "Nivel más visitado: " + oneDayOfData.nivel;
        totalElement.innerHTML = "Todos: " + oneDayOfData.todos;
        idElement.innerHTML = "ID: " + oneDayOfData.id;

        // Prepare data for Dount Chart With Text
        const dataArrayforPieChart = [
            {
                "prodX" : oneDayOfData.prodX
            },
            {
                "prodX" : oneDayOfData.prodY
            }
        ];

        pieChartID = 'pieChartID' + x;
        pieChartElement = document.createElement('div');
        pieChartElement.id = pieChartID;
        pieChartElement.classList.add('chartContainer');

        // Prepare data for Bar Chart
        const dataForBarChart = [
            {
                "productName": "ProdX",
                "value": oneDayOfData.prodX
            }, {
                "productName": "ProdY",
                "value": oneDayOfData.prodY
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
        showBarChart(dataForBarChart, barChartID);
        showDonutChartWithText(dataArrayforPieChart, pieChartID);
    }

    showMainTable();
}

/**
 * Show Main Table 
 */
let showMainTable = () => {
    let htmlString = '',
    total = 0;
    nivel = 0;
    
    const totalEl = document.getElementById('total');
    const mainTable = document.getElementById('mainTable');

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
    }
    
    totalEl.innerHTML = total;
    mainTable.innerHTML += htmlString;
}

/**
 * Show Donut Chart
 */
let showDonutChartWithText = (dataArray, elementID) => {
    let pie=d3.pie()
            .value(function(d){
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

/**
 * 
 */
let showBarChart = (dataArray, elementID) => {
    const maxAmount = Math.max(parseInt(dataArray[0].value), parseInt(dataArray[1].value));
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

    svg
        .append("g")
        .attr("fill", '#b54fc7')
        .selectAll("rect")
        .data(dataArray.sort((a, b) => d3.descending(a.value, b.value)))
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.value))
        .attr('title', (d) => d.value)
        .attr("class", "rect")
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth());

    function yAxis(g) {
        g.attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, dataArray.format))
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


window.mobileCheck = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

/**
 * Check Window width to fix CSS for Desktop, when width > 1200px
 */
 let checkWidth = () => {
    if (window.innerWidth > 550) {
        let textElements = document.getElementById('pieChart').getElementsByTagName('text');
        textElements[0].style.fontSize = "17px";
        textElements[1].style.fontSize = "17px";
    }
}

// Bind event listener
window.onresize = checkWidth;


//-------------------------------------------
// init all functions (pageLoad)
init(dataset);
checkWidth();