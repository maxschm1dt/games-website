import data from "./landkreise_simplify200.geojson" assert { type: "json" };

var map = L.map("map").setView([49.79258938006419, 9.932129693357913], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function onEachFeature(feature, layer) {
  var pop = layer.bindPopup(
    "" + feature.properties.GEN + " (" + feature.properties.BEZ + ")"
  );
}

L.geoJSON(data, { onEachFeature: onEachFeature }).addTo(map);
