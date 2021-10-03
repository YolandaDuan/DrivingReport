let data = document.getElementById('data');
let r = new XMLHttpRequest();
const url = "https://raw.githubusercontent.com/Springworks/recruitment-waypoints-challenge/master/waypoints.json";
r.open("GET", url, true);

r.onreadystatechange = () => {
    if (r.readyState !== 4 || r.status !== 200) return;
    let wayPoints = JSON.parse(r.responseText);
    for (i = 0; i < wayPoints.length; i++) {
        let ts = new Date(wayPoints[i].timestamp);
        data.innerHTML += '<li>' + ts.toLocaleString() + '</li>'
    }
};
r.send();


let tableFromJson = () => {
    let wayPoints = JSON.parse(r.responseText);
    console.log(wayPoints.length);
    console.log(wayPoints[1].position.latitude + ", " + wayPoints[1].position.longitude);
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
                console.log("test" + i + j);
            } else {
                tabCell.innerHTML = wayPoints[i][col[j]];
            }  
        }
    }
    const divShowData = document.getElementById("showData");
    divShowData.innerHTML = "";
    divShowData.appendChild(table);
}
