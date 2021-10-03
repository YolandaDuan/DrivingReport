let data = document.getElementById('data');
let r = new XMLHttpRequest();
const url = "https://raw.githubusercontent.com/Springworks/recruitment-waypoints-challenge/master/waypoints.json";
r.open("GET", url, true);

r.onreadystatechange = () => {
    if (r.readyState !== 4 || r.status !== 200) return;
    let wayPoints = JSON.parse(r.responseText);
    let distSpeeding = 0, duraSpeeding = 0, totDistance= 0, totDuration = 0; 
    for (i = 0; i < wayPoints.length; i++) {
        const limit = 8.33;
        let tsN = new Date(wayPoints[i].timestamp);
        data.innerHTML += '<li>' + tsN.toLocaleString() + '</li>'
        if (i > 0) {
            let tsO = new Date(wayPoints[i-1].timestamp);
            let interval = tsN.getSeconds() - tsO.getSeconds();
            let latO = wayPoints[i-1].position.latitude;
            let latN = wayPoints[i].position.latitude;
            let lonO = wayPoints[i-1].position.longitude;
            let lonN = wayPoints[i].position.longitude;
            console.log(latO, latN, lonO, lonN);
            let distance = (latO, latN, lonO, lonN) => {
                if ((latN === latO) && (lonN === lonO)) {
                    return 0;
                } else {
                    radLatO = Math.PI * latO/180;
                    radLatN = Math.PI * latN/180;
                    theta = lonN-lonO;
                    radTheta = Math.PI * theta/180;
                    let dist = Math.sin(radLatN) * Math.sin(radLatO) + Math.cos(radLatN) * Math.cos(radLatO) * Math.cos(radTheta);
               
                    if (dist > 1) {
                        dist = 1;
                    }
                    dist = Math.acos(dist) * 180/Math.PI * 60 * 1.1515;
                    // return distance in meters
                    return dist * 1609.344;   
                }
            }
            let distanceON = distance(latO, latN, lonO, lonN);
            console.log("distance is: " + distanceON.toFixed(2) + " meters");
            let speed = (distanceON/interval).toFixed(2);
            console.log("speed is: " + speed + " meters/second");
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
    }
    console.log("Speedy distance equals to: " + distSpeeding.toFixed(2) + " meters.");
    console.log("Speedy duration equals to: " + duraSpeeding + " seconds.");
    console.log("Total driving distance equals to: " + totDistance.toFixed(2) + " meters.");
    console.log("Total driving duration equals to: " + totDuration + " seconds.");
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
    const table = document.createElement("table");

    let tr = table.insertRow(-1);

    for (let i = 0; i < col.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    for (let i = 0; i < wayPoints.length; i++) {
        tr = table.insertRow(-1);
        for (let j = 0; j < col.length; j++) {
            let tabCell = tr.insertCell(-1);
            if(j == 1) {
                tabCell.innerHTML = wayPoints[i].position.latitude + ", " + wayPoints[1].position.longitude;
            } else {
                tabCell.innerHTML = wayPoints[i][col[j]];
            }  
        }
    }
    const divShowData = document.getElementById("showData");
    divShowData.innerHTML = "";
    divShowData.appendChild(table);
}
