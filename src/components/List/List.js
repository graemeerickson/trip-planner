import React, { Component } from 'react';
//react component
import ListItem from ".././ListItem/ListItem.js";

class List extends Component {
    render() {
        return (
            <ul className="locations-list">
                {this.props.locationData.map((location) => {
                    return (<ListItem name={location.name} />)
                })}
            </ul>
        );
    }
}
export default List;
