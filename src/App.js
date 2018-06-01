import React, { Component } from 'react';
import './App.css';

//React components
import Map from "./components/Map/Map.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map />
      </div>
    );
  }
}

export default App;
