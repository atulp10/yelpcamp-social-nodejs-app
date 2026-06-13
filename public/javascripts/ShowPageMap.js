const mapContainer = document.getElementById('map');
const coordinates = campground.geometry?.coordinates;

if (!mapToken || !Array.isArray(coordinates) || coordinates.length !== 2) {
    mapContainer.hidden = true;
} else {
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinates,
        zoom: 9,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    const content = document.createElement('div');
    const title = document.createElement('strong');
    const location = document.createElement('p');
    title.textContent = campground.title;
    location.textContent = campground.location;
    location.className = 'mb-0 mt-1';
    content.append(title, location);

    new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setDOMContent(content))
        .addTo(map);
}
