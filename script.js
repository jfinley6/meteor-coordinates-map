//Once DOM Content is loaded map will generated and data function will be invoked
document.addEventListener('DOMContentLoaded', () => {
    meteorData();
})

//Meteor data that will be passed into createTiles function
let meteorData = () => {
    fetch("https://data.nasa.gov/resource/gh4g-9sfh.json")
        .then(res => res.json())
        .then(data => {
            data = data.sort((a, b) => a.name.localeCompare(b.name))
            createTiles(data)
        })
}

//Will build a tile for each meteor in API and generate them on the screen
function createTiles(meteorData) {
    const map = L.map('map').setView([39.7392, -104.9903], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    const Icon = L.icon({
        iconUrl: 'meteor_PNG22.png',
        iconSize: [38, 95], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    })

    let marker = {}
    marker = L.marker([0, 0], 1)
    marker.addTo(map)
    marker.setOpacity(0)

    const selector = document.querySelector("#selector")
    selector.addEventListener('change', () => {
        switch (selector.value) {
            case "nameA-Z":
                const nameAZ = meteorData.sort((a, b) => a.name.localeCompare(b.name))
                doSomething(nameAZ, map, marker)
                break;
            case "nameZ-A":
                const nameZA = meteorData.sort((a, b) => b.name.localeCompare(a.name))
                doSomething(nameZA, map, marker)
                break
            case "massSmallest":
                const massSmallestToLargest = meteorData.sort((a, b) => Number(a.mass) - Number(b.mass));
                doSomething(massSmallestToLargest, map, marker)
                break
            case "massLargest":
                const massLargestToSmallest = meteorData.sort((a, b) => Number(b.mass) - Number(a.mass));
                doSomething(massLargestToSmallest, map, marker)
                break
            default:

        }

    })


    doSomething(meteorData, map, marker)

}

function doSomething(meteorData, map, marker) {
    const divCheck = document.getElementsByClassName("meteor-data")
    if (typeof divCheck == 'object') {
        for (let i = divCheck.length - 1; i >= 0; --i) {
            divCheck[i].remove();
        }
    } 

    
    //For each API index, show the information on page
    for (item of meteorData) {
        if (item.reclat === undefined) {
            continue;
        }

        const meteorInfo = document.querySelector(".meteor-info")
        const div = document.createElement("div")
        div.classList.add("meteor-data")
        meteorInfo.appendChild(div)

        const table = document.createElement("table")
        const tbody = document.createElement("tbody")

        div.appendChild(table)
        table.appendChild(tbody)

        const tr1 = document.createElement("tr")
        const tr2 = document.createElement("tr")
        const tr3 = document.createElement("tr")
        const tr4 = document.createElement("tr")
        const td1 = document.createElement("td")
        const td2 = document.createElement("td")
        const td3 = document.createElement("td")
        const td4 = document.createElement("td")
        const td5 = document.createElement("td")
        const td6 = document.createElement("td")
        const td7 = document.createElement("td")
        const td8 = document.createElement("td")

        tbody.appendChild(tr1)
        tr1.appendChild(td1)
        tr1.appendChild(td2)
        td1.textContent = "Name:"
        td2.innerHTML = `<b>${item.name}</b>`

        tbody.appendChild(tr2)
        tr2.appendChild(td3)
        tr2.appendChild(td4)
        td3.textContent = "Mass:"
        td4.innerHTML = `<b>${item.mass}g</b>`
        if (item.mass === undefined) {
            td4.innerHTML = "<b>N/A</b>"
        }

        tbody.appendChild(tr3)
        tr3.appendChild(td5)
        tr3.appendChild(td6)
        td5.textContent = "Latitude:"
        const latitudeNumber = item.reclat
        const latReduceDigits = latitudeNumber.slice(0, -4);
        td6.innerHTML = `<b>${latReduceDigits}</b>`

        tbody.appendChild(tr4)
        tr4.appendChild(td7)
        tr4.appendChild(td8)
        td7.textContent = "Longitude:"
        const longitudeNumber = item.reclong
        const lonReduceDigits = longitudeNumber.slice(0, -4);
        td8.innerHTML = `<b>${lonReduceDigits}</b>`

        const btn = document.createElement("button")
        btn.textContent = "View on Map"
        div.appendChild(btn)
        btn.addEventListener('click', (e) => {
            const latitude = e.path[1].childNodes[0].childNodes[0].childNodes[2].childNodes[1].textContent
            const longitude = e.path[1].childNodes[0].childNodes[0].childNodes[3].childNodes[1].textContent;
            const name = e.path[1].childNodes[0].childNodes[0].childNodes[0].childNodes[1].textContent
            map.setView([latitude, longitude], 5);
            marker.setLatLng([latitude, longitude])
            marker.setOpacity(100)
            marker.bindPopup(`<b>${name}</b><br>Latitude: ${latitude}<br>Longitute: ${longitude}`).openPopup();
        })
    }
}