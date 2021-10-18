const tableFromJson = () => {
    let wayPoints = fetchWaypoints();
    let column = [];

    for (let i = 0; i < wayPoints.length; i++) {
        for (let key in wayPoints[i]) {
            if (column.indexOf(key) === -1) {
                column.push(key);
            }
        }
    }
    let logTable = document.createElement("table");

    let tr = logTable.insertRow();

    for (let i = 0; i < column.length + 1; i++) {
        let th = document.createElement("th");
        if (i === column.length) {
            th.innerText = "WAYPOINT";
        } else {
            th.innerHTML = column[i].toUpperCase();
        }
        tr.append(th);
    }

    for (let i = 0; i < wayPoints.length; i++) {
        let tr = logTable.insertRow();
        for (let j = 0; j < column.length; j++) {
            let td = tr.insertCell();
            if(column[j] === "timestamp") {
                let ts = new Date(wayPoints[i].timestamp);
                td.innerHTML = ts.toLocaleString();
            } else if(column[j] === "position") {
                td.innerHTML = wayPoints[i].position.latitude + ", " + wayPoints[1].position.longitude;
            } else {
                td.innerHTML = wayPoints[i][column[j]];
            }  
        }
    }

    for(let i = 1; i < logTable.rows.length; i++) {
        let index = document.createTextNode(i);
        logTable.rows[i].insertCell(logTable.rows[i].cells.length).append(index);   
    }

    let divShowLog = document.getElementById("showLog");
    divShowLog.innerHTML = "";
    divShowLog.append(logTable);
}

const fetchWaypoints = () => {
    const url = "https://raw.githubusercontent.com/Springworks/recruitment-waypoints-challenge/master/waypoints.json";
    let data = new XMLHttpRequest();
    data.open("GET", url, false);
    data.send();
    let wayPoints = JSON.parse(data.responseText);

    return wayPoints;
}

const generateReport = () => {
    let calculator = new Calculator();
    let wayPoints = fetchWaypoints();
    const {reportSummary, reportRows} = calculator.calculateReport(wayPoints);

    printRows(reportRows); 
    printSummary(reportSummary);
}

class Calculator {
    calculateDist(firstLatitude, nextLatitude, firstLongitude, nextLongitude) {
        let radLatO = Math.PI * firstLatitude/180;
        let radLatN = Math.PI * nextLatitude/180;
        let theta = nextLongitude-firstLongitude;
        let radTheta = Math.PI * theta/180;
        let distance = Math.sin(radLatN) * Math.sin(radLatO) + Math.cos(radLatN) * Math.cos(radLatO) * Math.cos(radTheta);
    
        if (distance > 1) {
            distance = 1;
        }
        distance = Math.acos(distance) * 180/Math.PI * 60 * 1.1515;
        // return distance in meters
        return distance * 1609.344;   
    }
    
    calculateReport(wayPoints) {
        let reportSummary = {
                distSpeeding: 0, 
                duraSpeeding: 0, 
                totDistance: 0, 
                totDuration: 0
                };
        let reportRows = [];
    
        for (let i = 1; i < wayPoints.length; i++) {
            let nextTimeStamp = new Date(wayPoints[i].timestamp);
            let firstTimeStamp = new Date(wayPoints[i-1].timestamp);
    
            // interval in seconds
            let interval = (nextTimeStamp.getTime() - firstTimeStamp.getTime())/1000;
            let reportRow = {
                header: undefined,
                description: undefined
            };
    
            const { latitude: firstLatitude, longitude: firstLontitudg } = wayPoints[i-1].position;
            const { latitude: nextLatitude, longitude: nextLongitude } = wayPoints[i].position;
    
            let distance = this.calculateDist(firstLatitude, nextLatitude, firstLontitudg, nextLongitude);
            let averageSpeed = (distance/interval);
    
            if (averageSpeed > wayPoints[i].speed_limit || averageSpeed > wayPoints[i-1].speed_limit) {
                reportSummary.distSpeeding += distance;
                reportSummary.duraSpeeding += interval;
                reportSummary.totDistance += distance;
                reportSummary.totDuration += interval;
                reportRow.header = { fromWaypoint: i, toWaypoint: i+1, isSpeeding: true }
    
            } else {
                reportSummary.totDistance += distance;
                reportSummary.totDuration += interval;
                reportRow.header = { fromWaypoint: i, toWaypoint: i+1, isSpeeding: false }
            }    
            
            reportRow.description = { distance: distance.toFixed(2), speed: averageSpeed.toFixed(2), duration: interval };
            reportRows.push(reportRow);
        }
    
        return {reportSummary, reportRows};
    }
}

const printRows = (reportRows) => {
    const overspeedMark = '<span id="overspeed" class="warn">OVERSPEED</span>';
    let template = "";
    for(row of reportRows) {
        template += `<h4>From waypoint ${row.header.fromWaypoint} to ${row.header.toWaypoint} ${row.header.isSpeeding ? overspeedMark : null} </h4>
                        <p> Distance: ${row.description.distance} meters;
                            Speed: ${row.description.speed} meters/second;
                            Duration: ${row.description.duration} seconds.
                        </p>`;
    }
    let calculate = document.getElementById("calculate");
    calculate.innerHTML = template;
}

const printSummary = (reportSummary) => {
    let template =  `<h3>SUMMARY</h3>
                        <ol>
                            <li> Speeding distance equals to: ${reportSummary.distSpeeding.toFixed(2)} meters.</li>
                            <li> Speeding duration equals to: ${reportSummary.duraSpeeding} seconds.</li>
                            <li> Total driving distance equals to: ${reportSummary.totDistance.toFixed(2)} meters.</li>
                            <li> Total driving duration equals to: ${reportSummary.totDuration} seconds.</li>
                        </ol>`;  
    let divShowReport = document.getElementById("showReport");
    divShowReport.innerHTML = template;                

}

module.exports = Calculator;