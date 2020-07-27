//This uses Day 1 - Activity 10 as the baseline, updated with new code
// Store our API endpoint inside queryUrl
// Set variable for the Earthquake API
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Used to Set color scale for the earthquake markers
function getColor(d) {
  return d > 5 ? '#FF5700' :
         d > 4 ? '#FF8C00' :
         d > 3 ? '#FFC100' :
         d > 2 ? '#FFF600' :
         d > 1 ? '#D4FF00' :
                 '#B0FF00';
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function CreateFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p> Magnitude: " + feature.properties.mag +
    "<br> Coordinates: " + feature.geometry.coordinates +
    "<br> Date/Time: " + new Date(feature.properties.time) +
    "</p>");
  }
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: CreateFeature,
    
    pointToLayer: function (feature, Coordinates) {
      return new L.circle(Coordinates,
        {radius: feature.properties.mag * 10000,
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 1,
        color: "Black",
        weight: .5
        })
      }
  });

// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

  // Sattelite Map Layer looks the best
  var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
  });

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [40, -115],
    zoom: 5,
    layers: [satmap, earthquakes]
  });

// creating the legend
var legend = L.control({position: 'bottomright'});

// add legend to map
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0,1,2,3,4,5],
    labels = [];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
           '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
           grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);
}

