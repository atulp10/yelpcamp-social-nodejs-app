
const coordinates = campground.geometry && campground.geometry.coordinates;

if (coordinates) {
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: coordinates, // starting position [lng, lat]
        zoom: 9, // starting zoom
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    // Create a Marker and add it to the map.
    new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(new mapboxgl
            .Popup()
            .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)) // add popup
        .addTo(map);
} else {
    console.warn('Campground is missing geometry coordinates.');
}
