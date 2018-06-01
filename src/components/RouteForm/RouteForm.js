import React, { Component } from 'react';

class RouteForm extends Component {
  constructor() {
    super()
    this.state = {
      origin: "",
      dest: "",
      radius: ""
    }
  }

  handleOriginLocationChange = (e) => { this.setState({ origin: e.target.value }); }
  handleDestLocationChange = (e) => { this.setState({ dest: e.target.value }); }
  handleRadiusDistanceChange = (e) => { this.setState({ radius: e.target.value }); }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', e)
    this.props.updateTripLocations(this.state.origin, this.state.dest, this.state.radius)
  }

  render() {
    return (
      <div className="routeForm">
        <form onSubmit={this.handleSubmit}>
          <br/>
          <label>Origin: </label><input type="text" onChange={this.handleOriginLocationChange} /><br/>
          <label>Destination: </label><input type="text" onChange={this.handleDestLocationChange} /><br/>
          <label>Distance radius (miles): </label><input type="text" onChange={this.handleRadiusDistanceChange} /><br/>
          <input type="submit" /><br/><br/>
        </form>
      </div>
    );
  }
}

export default RouteForm;