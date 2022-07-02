document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML

    const map = L.map('map').setView([39.7392, -104.9903], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: '© OpenStreetMap'
    }).addTo(map);
})

// let meteorData = () => {
//     fetch("https://data.nasa.gov/resource/gh4g-9sfh.json")
//         .then(res => res.json())
//         .then(data => {
            
//         })
// }