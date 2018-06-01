import React, { Component } from 'react';

//React components
import RouteForm from ".././RouteForm/RouteForm.js";
import Map from ".././Map/Map.js";

class RoutePlan extends Component {
  constructor() {
    super()
    this.state = {
      origin: "",
      dest: "",
      radius: ""
    }
  }

  getTripLocations = (originLocation, destLocation, distanceRadius) => {
    console.log('originLocation:', originLocation)
    console.log('destLocation:', destLocation)
    console.log('distanceRadius:', distanceRadius)
    this.setState({
      origin: originLocation,
      dest: destLocation,
      radius: distanceRadius
    })
  }

  render() {
    return (
      <section id="RoutePlan">
          <RouteForm updateTripLocations={this.getTripLocations} />
          <Map tripOrigin={this.state.origin} tripDest={this.state.dest} tripRadius={this.state.radius} destLocation={this.state.dest}/>
      </section>
    );
  }
}

export default RoutePlan;
