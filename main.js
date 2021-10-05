let data = document.getElementById('data');
let r = new XMLHttpRequest();
const url = "https://raw.githubusercontent.com/Springworks/recruitment-waypoints-challenge/master/waypoints.json";
r.open("GET", url, true);

r.onreadystatechange = () => {
    if (r.readyState !== 4 || r.status !== 200) return; 
};
r.send();

let tableFromJson = () => {
    let wayPoints = JSON.parse(r.responseText);
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

    let tr = logTable.insertRow(-1);

    for (let i = 0; i < col.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = col[i].toUpperCase();
        tr.append(th);
    }

    for (let i = 0; i < wayPoints.length; i++) {
        tr = logTable.insertRow(-1);
        for (let j = 0; j < col.length; j++) {
            let tabCell = tr.insertCell(-1);
            if(j === 0) {
                let ts = new Date(wayPoints[i].timestamp);
                tabCell.innerHTML = ts.toLocaleString();
            } else if(j === 1) {
                tabCell.innerHTML = wayPoints[i].position.latitude + ", " + wayPoints[1].position.longitude;
            } else {
                tabCell.innerHTML = wayPoints[i][col[j]];
            }  
        }
    }

    const divShowLog = document.getElementById("showLog");
    divShowLog.innerHTML = "";
    divShowLog.append(logTable);
}

let calculateDist = (latO, latN, lonO, lonN) => {
    if ((latN === latO) && (lonN === lonO)) {
        return 0;
    } else {
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
}

let finalCalcu = (wayPoints) => {
    let distSpeeding = 0, duraSpeeding = 0, totDistance= 0, totDuration = 0; 
    const limit = 8.33;
    for (i = 1; i < wayPoints.length; i++) {
        let tsN = new Date(wayPoints[i].timestamp);
        let tsO = new Date(wayPoints[i-1].timestamp);
        let interval = tsN.getSeconds() - tsO.getSeconds();

        const coordinateO = [wayPoints[i-1].position.latitude, wayPoints[i-1].position.longitude]
        const coordinateN = [wayPoints[i].position.latitude, wayPoints[i].position.longitude]

        const [latO, lonO] = coordinateO;
        const [latN, lonN] = coordinateN;

        let distanceON = calculateDist(latO, latN, lonO, lonN);
        console.log(`Distance between waypoint[${i}] and waypoint[${i+1}] is: ${distanceON.toFixed(2)} meters`);
        let speed = (distanceON/interval).toFixed(2);
        console.log("Speed is: " + speed + " meters/second");
        if (speed > limit) {
            distSpeeding += distanceON;
            duraSpeeding += interval;
            totDistance += distanceON;
            totDuration += interval;
        } else {
            totDistance += distanceON;
            totDuration += interval;
        }     
    }
   
    return [distSpeeding, duraSpeeding, totDistance, totDuration];
}

let generateReport = () => {
    let wayPoints = JSON.parse(r.responseText);
    
    const [distSpeeding, duraSpeeding, totDistance, totDuration] = finalCalcu(wayPoints);

    const divShowReport = document.getElementById("showReport");
    divShowReport.innerHTML = `<ol>
                                <li> Speeding distance equals to: &nbsp; <strong>${distSpeeding.toFixed(2)}</strong> &nbsp; meters.</li>
                                <li> Speeding duration equals to: &nbsp; <strong>${duraSpeeding}</strong> &nbsp; seconds.</li>
                                <li> Total driving distance equals to: &nbsp;<strong>${totDistance.toFixed(2)}</strong> &nbsp; meters.</li>
                                <li> Total driving duration equals to: &nbsp;<strong>${totDuration}</strong> &nbsp; seconds.</li>
                               </ol>`;   

}


