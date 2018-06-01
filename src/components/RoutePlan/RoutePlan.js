import React, { Component } from 'react';

//React components
import RouteForm from ".././RouteForm/RouteForm.js";
import List from ".././List/List.js";
import Map from ".././Map/Map.js";
var map = null;
var boxpolys = null;
var directions = null;
var routeBoxer = null;
var distance = null;
var directionService = null;
var directionsRenderer = null;
var infoWindow = new window.google.maps.InfoWindow();
var service = null;
class RoutePlan extends Component {
  constructor() {
    super()
    this.state = {
      origin: "",
      dest: "",
      radius: "",
      miles: true,
      locationData: [],
      maxPOI:10,
    }
  }
  componentDidMount() {
    this.initialize();
  }
  // Clear boxes currently on the map
  clearBoxes = () => {
    if (boxpolys != null) {
      for (var i = 0; i < boxpolys.length; i++) {
        boxpolys[i].setMap(null);
      }
    }
    boxpolys = null;
  }
  drawBoxes = (boxes) => {
    boxpolys = new Array(boxes.length);
    for (var i = 0; i < boxes.length; i++) {
      boxpolys[i] = new window.google.maps.Rectangle({
        bounds: boxes[i],
        fillOpacity: 0,
        strokeOpacity: 1.0,
        strokeColor: '#000000',
        strokeWeight: 1,
        map: map
      });
    }
  }
  route = () => {
    // Clear any previous route boxes from the map
    this.clearBoxes();

    if (this.state.miles === true) {
      // Convert the distance to box around the route from miles to km            
      distance = parseFloat(this.state.radius) * 1.609344;
    } else {
      //Use KM
      distance = parseFloat(this.state.radius);
    }

    var request = {
      origin: this.state.origin,
      destination: this.state.dest,
      travelMode: window.google.maps.DirectionsTravelMode.DRIVING
    }
    // Make the directions request
    directionService.route(request, (result, status) => {
      if (status == window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);

        // Box around the overview path of the first route
        var path = result.routes[0].overview_path;
        var boxes = routeBoxer.box(path, distance);
        this.searchBounds(boxes);
      } else {
        alert("Directions query failed: " + status);
      }
    });
  }
  initialize = () => {
    // Default the map view to the continental U.S.
    var mapOptions = {
      center: new window.google.maps.LatLng(37.09024, -95.712891),
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      zoom: 4
    };
    map = new window.google.maps.Map(document.getElementById("map"), mapOptions);
    routeBoxer = new window.RouteBoxer();
    directionService = new window.google.maps.DirectionsService();
    directionsRenderer = new window.google.maps.DirectionsRenderer({ map: map });
    service = new window.google.maps.places.PlacesService(map);
  }
  searchBounds = (bound) => {
    for (let i = 0; i < bound.length; i++) {
        ((i) => {
          setTimeout(() => {
            this.performSearch(bound[i]);
          }, i * 400);
        })(i);
    }
  }
  performSearch = (bounds) => {
    var request = {
      bounds: bounds,
      keyword: 'things to do'
    };

    service.radarSearch(request, this.callback);
  }

  callback = (results, status) => {
    if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
      console.error(status);
      return;
    }    
    for (var i = 0, result; result = results[i]; i++) {
      this.addMarker(result);
    }
  }

  addMarker = (place) => {
    var marker = new window.google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: {
        url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
        anchor: new window.google.maps.Point(10, 10),
        scaledSize: new window.google.maps.Size(10, 17)
      }
    });

    window.google.maps.event.addListener(marker, 'click', () => {
      let request = { placeId: place.place_id };

      service.getDetails(request, (result, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        infoWindow.setContent(result.name);
        infoWindow.open(map, marker);
      });
    });
    let request = { placeId: place.place_id };
    service.getDetails(request, (result, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      let t = this.state.locationData;
      t.push({
        name:result.name,
        id:place.place_id
      });
      this.setState({
        locationData: t,
      });
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    });
    console.log("plc", place);
  }
  getTripLocations = (originLocation, destLocation, distanceRadius) => {
    console.log('originLocation:', originLocation)
    console.log('destLocation:', destLocation)
    console.log('distanceRadius:', distanceRadius)
    this.setState({
      origin: originLocation,
      dest: destLocation,
      radius: distanceRadius
    });
    this.route();
  }

  render() {
    console.log("LOCATION DATA", this.state.locationData);
    if (this.state.locationData.length < 1) {
      return (
        <section id="RoutePlan">
          <RouteForm updateTripLocations={this.getTripLocations} />
          <Map miles={this.state.miles} tripOrigin={this.state.origin} tripDest={this.state.dest} tripRadius={this.state.radius} destLocation={this.state.dest} />
        </section>
      );
    } else {
      return (
        <section id="RoutePlan">
          <RouteForm updateTripLocations={this.getTripLocations} />
          <Map miles={this.state.miles} tripOrigin={this.state.origin} tripDest={this.state.dest} tripRadius={this.state.radius} destLocation={this.state.dest} />
          <List locationData={this.state.locationData} service={service} />
        </section>
      )
    }
  }
}

export default RoutePlan;
