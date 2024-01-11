mapboxgl.accessToken =
  mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinate, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const el = document.createElement('div');
el.id = 'marker';

const marker1 = new mapboxgl.Marker(el)
.setLngLat(coordinate)
.addTo(map);