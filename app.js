let lat, long;
const myLatLng = { lat: 12.8797, lng: 121.774 };

const mapOption = {
  center: myLatLng,
  zoom: 6.8,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
};

const map = new google.maps.Map(
  document.getElementById("googleMap"),
  mapOption
);

const directionService = new google.maps.DirectionsService();
const directionDisplay = new google.maps.DirectionsRenderer();
var geocoder = new google.maps.Geocoder();




directionDisplay.setOptions({
  polylineOptions: {
    strokeColor: "red",
    geodesic: true,
    strokeOpacity: 0.6,
    strokeWeight: 5,
  },
});

directionDisplay.setMap(map);

navigator.geolocation.getCurrentPosition((position) => {
  lat = position.coords.latitude;
  long = position.coords.longitude;

  new google.maps.Marker({
    position: { lat: position.coords.latitude, lng: position.coords.longitude },
    map,
    title: "Plate Number",
  });

  new google.maps.Circle({
    strokeColor: "#1E90FF",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "skyblue",
    fillOpacity: 0.35,
    map: map,
    center: { lat: lat, lng: long },
    radius: 100,
  });
});

function calculateDistance() {

  var latLng = new google.maps.LatLng(lat, long);


  geocoder.geocode({ 'latLng': latLng }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {

        const formattedAddress = results[0].formatted_address;

        const request = {
          origin: document.getElementById("from").value  || formattedAddress,
          destination: document.getElementById("to").value,
          travelMode: google.maps.TravelMode["DRIVING"],
          unitSystem: google.maps.UnitSystem.IMPERIAL,
          optimizeWaypoints: true,
          provideRouteAlternatives: true,
          avoidFerries: true,
          avoidHighways: true,
          avoidTolls: true,
        };
      
        directionService.route(request, function (result, status) {
          const output = document.getElementById("output");
      
          if (status === google.maps.DirectionsStatus.OK) {
            output.innerHTML = `<div class="alert-info" > 
            From:  ${formattedAddress}
            <br/>To: 
            ${document.getElementById("to").value}
            <br/> distance :
            ${result.routes[0].legs[0].distance.text}
            <br/>durantion :
            ${result.routes[0].legs[0].duration.text}
            </div> `;
      
            directionDisplay.setDirections(result);
          } else {
            directionDisplay.setDirections({ routes: [] });
            map.setCenter(myLatLng);
      
            output.innerHTML = `<div class="alert-danger">Could not retrieve driving distance</div>`;
          }
        });


      } else {
        console.log('No results found');
      }
    } else {
      console.log('Geocoder failed due to: ' + status);
    }
  });


}





const to = document.getElementById("to");
const from = document.getElementById("from");

const autoComplete1 = new google.maps.places.Autocomplete(to, {
  componentRestrictions: { country: "ph" },
});
const autoComplete2 = new google.maps.places.Autocomplete(from, {
  componentRestrictions: { country: "ph" },
});



