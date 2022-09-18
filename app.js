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
  console.log("lat : " + lat, "long : " + long);
  const request = {
    origin: `${lat},${long}`,
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
      From:  ${lat},${long}
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
}





const to = document.getElementById("to");

const autoComplete2 = new google.maps.places.Autocomplete(to, {
  componentRestrictions: { country: "ph" },
});



