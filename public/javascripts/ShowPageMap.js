
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

// Create a Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl
        .Popup()
        .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)) // add popup
    .addTo(map);