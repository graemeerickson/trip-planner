import React, { Component } from 'react';
var map = null;
var boxpolys = null;
var directions = null;
var routeBoxer = null;
var distance = null;
var directionService = null;
var directionsRenderer = null;
var infoWindow = new window.google.maps.InfoWindow();
var service = null;
class Map extends Component {
    constructor() {
        super();
        this.state = {
            origin: "seattle",
            dest: "kent,wa",
            radius: "1",
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

        // Convert the distance to box around the route from miles to km
        distance = parseFloat(this.state.radius) * 1.609344;

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
                console.log(boxes);
                //this.drawBoxes(boxes);
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

                    // Perform search on the bound and save the result
                    this.performSearch(bound[i]);

                    //If the last box
                    if ((bound.length - 1) === i) {
                        //this.addMarker(bound);
                    }
                }, i*400);
            })(i);
        }
    }
    performSearch = (bounds) => {
        console.log("bounds",bounds);
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
            var request = { placeId: place.place_id };

            service.getDetails(request, (result, status) => {
                if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
                    console.error(status);
                    return;
                }
                infoWindow.setContent(result.name);
                infoWindow.open(map, marker);
            });
        });
        console.log(place);
    }
    render() {
        return (
            <div className="Map">
                <div id="map"></div>
                Box within at least
                <input type="text" id="distance" value="30" size="2" />
                miles of the route from
                <input type="text" id="from" value={this.state.origin} />
                to <input type="text" id="to" value={this.state.dest} />
                <input type="submit" onClick={this.route} />
            </div>
        );
    }
}
export default Map;
