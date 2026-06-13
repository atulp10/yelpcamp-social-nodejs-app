const mapContainer = document.getElementById('cluster-map');

if (!mapToken || !campgrounds.features.length) {
    mapContainer.hidden = true;
} else {
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'cluster-map',
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-103.5917, 40.6699],
        zoom: 3,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    map.on('load', () => {
        map.addSource('campgrounds', {
            type: 'geojson',
            data: campgrounds,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
        });

        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': ['step', ['get', 'point_count'], '#167d6b', 10, '#d18b1f', 50, '#b23a48'],
                'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 50, 40],
            },
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'campgrounds',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
            },
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'campgrounds',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#167d6b',
                'circle-radius': 6,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff',
            },
        });

        map.on('click', 'clusters', event => {
            const feature = map.queryRenderedFeatures(event.point, { layers: ['clusters'] })[0];
            if (!feature) return;
            map.getSource('campgrounds').getClusterExpansionZoom(
                feature.properties.cluster_id,
                (error, zoom) => {
                    if (!error) map.easeTo({ center: feature.geometry.coordinates, zoom });
                }
            );
        });

        map.on('click', 'unclustered-point', event => {
            const feature = event.features[0];
            const coordinates = feature.geometry.coordinates.slice();
            while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            const content = document.createElement('div');
            const link = document.createElement('a');
            const location = document.createElement('p');
            link.href = `/campgrounds/${encodeURIComponent(feature.properties.id)}`;
            link.textContent = feature.properties.title;
            link.className = 'fw-bold';
            location.textContent = feature.properties.location;
            location.className = 'mb-0 mt-1';
            content.append(link, location);

            new mapboxgl.Popup().setLngLat(coordinates).setDOMContent(content).addTo(map);
        });

        for (const layer of ['clusters', 'unclustered-point']) {
            map.on('mouseenter', layer, () => { map.getCanvas().style.cursor = 'pointer'; });
            map.on('mouseleave', layer, () => { map.getCanvas().style.cursor = ''; });
        }
    });
}
