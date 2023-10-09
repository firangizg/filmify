import React, { Component } from 'react';
import '../App.css';

import sample from './sample.json'

class Characteristics extends Component {
  render() {
    return (
      <div id="Characteristics">
        <h3>Characteristics</h3>
        <div className="characteristics-container">
          {sample.characteristics.map((item) => (
            <div className="characteristic">
              <h4>{item.characteristic_name}</h4>
              <p>{item.characteristic_score}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Characteristics;