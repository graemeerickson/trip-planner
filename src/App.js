import React, { Component } from 'react';
import './App.css';

//React components
import RoutePlan from "./components/RoutePlan/RoutePlan.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <RoutePlan />
      </div>
    );
  }
}

export default App;
