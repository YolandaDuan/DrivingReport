const fetchWaypoints = () => {
    const url = "https://raw.githubusercontent.com/Springworks/recruitment-waypoints-challenge/master/waypoints.json";
    let r = new XMLHttpRequest();
    r.open("GET", url, false);
    r.send();
    let wayPoints = JSON.parse(r.responseText);

    return wayPoints;
}

const tableFromJson = () => {
    let wayPoints = fetchWaypoints();
    console.log(wayPoints);
    let col = [];

    for (let i = 0; i < wayPoints.length; i++) {
        for (let key in wayPoints[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    let logTable = document.createElement("table");

    let tr = logTable.insertRow();

    for (let i = 0; i < col.length + 1; i++) {
        let th = document.createElement("th");
        if (i === col.length) {
            th.innerText = "WAYPOINT";
        } else {
            th.innerHTML = col[i].toUpperCase();
        }
        tr.append(th);
    }

    for (let i = 0; i < wayPoints.length; i++) {
        let tr = logTable.insertRow();
        for (let j = 0; j < col.length; j++) {
            let td = tr.insertCell();
            if(j === 0) {
                let ts = new Date(wayPoints[i].timestamp);
                td.innerHTML = ts.toLocaleString();
            } else if(j === 1) {
                td.innerHTML = wayPoints[i].position.latitude + ", " + wayPoints[1].position.longitude;
            } else {
                td.innerHTML = wayPoints[i][col[j]];
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

const calculateDist = (latO, latN, lonO, lonN) => {
    let radLatO = Math.PI * latO/180;
    let radLatN = Math.PI * latN/180;
    let theta = lonN-lonO;
    let radTheta = Math.PI * theta/180;
    let dist = Math.sin(radLatN) * Math.sin(radLatO) + Math.cos(radLatN) * Math.cos(radLatO) * Math.cos(radTheta);

    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist) * 180/Math.PI * 60 * 1.1515;
    // return distance in meters
    return dist * 1609.344;   
}

const calculateReport = (wayPoints) => {
    const reportSummary = {
        distSpeeding: 0, 
        duraSpeeding: 0, 
        totDistance: 0, 
        totDuration: 0
    };
    let reportRows = [];

    for (i = 1; i < wayPoints.length; i++) {
        let tsN = new Date(wayPoints[i].timestamp);
        let tsO = new Date(wayPoints[i-1].timestamp);
        let interval = tsN.getSeconds() - tsO.getSeconds();
        let reportRow = {
            header: undefined,
            description: undefined
        };

        const { latitude: latO, longitude: lonO } = wayPoints[i-1].position;
        const { latitude: latN, longitude: lonN } = wayPoints[i].position;

        let distanceON = calculateDist(latO, latN, lonO, lonN);
        let speed = (distanceON/interval);

        if (speed > wayPoints[i].speed_limit) {
            reportSummary.distSpeeding += distanceON;
            reportSummary.duraSpeeding += interval;
            reportSummary.totDistance += distanceON;
            reportSummary.totDuration += interval;
            reportRow.header = { fromWaypoint: i, toWaypoint: i+1, isSpeeding: true }

        } else {
            reportSummary.totDistance += distanceON;
            reportSummary.totDuration += interval;
            reportRow.header = { fromWaypoint: i, toWaypoint: i+1, isSpeeding: false }
        }    
        
        reportRow.description = { distance: distanceON.toFixed(2), speed: speed.toFixed(2), duration: interval };
        reportRows.push(reportRow);
    }

    return {reportSummary, reportRows};
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

const generateReport = () => {
    let wayPoints = fetchWaypoints();
    const {reportSummary, reportRows} = calculateReport(wayPoints);

    printRows(reportRows); 
    printSummary(reportSummary);
}

export default { calculateDist, calculateReport };