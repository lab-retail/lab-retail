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

readTextFile("./json/data.json", function(text){
    let data = JSON.parse(text)
        htmlString = '';

    const total = document.getElementById('total');
    const datesList = document.getElementById('dates');
    
    total.innerHTML = "Total: " + data.total;

    for (let x in data.dates) {
        htmlString += '<li>'
        htmlString += 'Date: ' + data.dates[x].date;
        htmlString += '<br />Value: ' + data.dates[x].value;
        htmlString += '</li>';
    }
    datesList.innerHTML = htmlString;
});