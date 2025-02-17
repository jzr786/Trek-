
mapboxgl.accessToken = mapToken;
let array = JSON.parse("[" + coordinates + "]");
console.log(array);

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: array[0], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});





const marker1 = new mapboxgl.Marker()
    .setLngLat(array[0])
    .setPopup(new mapboxgl.Popup({ offset: 25, className: 'my-class' })
        .setHTML("<p>Exact location provided after booking<p>"))
    .addTo(map);
