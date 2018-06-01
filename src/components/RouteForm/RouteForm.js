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
      <div className="route-form">
        <form onSubmit={this.handleSubmit}>
          <br/>
          <div className="form-inline trip-form-row row">
            <div className="col-5">
              <label>Start</label>
            </div>
            <div className="col-7">
              <input className="form-control-sm form-input-box" type="text" onChange={this.handleOriginLocationChange} />
            </div>
          </div>
          <div className="form-inline trip-form-row row">
            <div className="col-5">
              <label>Destination</label>
            </div>
            <div className="col-7">
              <input className="form-control-sm form-input-box" type="text" onChange={this.handleDestLocationChange} />
            </div>
          </div>
          <div className="form-inline trip-form-row row">
            <div className="col-5">
              <label>Radius (miles)</label>
            </div>
            <div className="col-7">
              <input className="form-control-sm form-input-box" type="text" onChange={this.handleRadiusDistanceChange} />
            </div>
          </div>
          <div className="form-group trip-form-row row">
            <div className="col-5">
            </div>
            <div className="col-7">
              <input className="btn btn-primary btn-sm trip-form-button" type="submit" value="Route" /><br/><br/>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default RouteForm;