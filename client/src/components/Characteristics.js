import React, { Component } from 'react';
import '../App.css';

class Characteristics extends Component {
  state = {
    characteristics: []
  };

  async componentDidMount() {
    const { accessToken } = this.props;

    // Fetch data from your backend
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/track-features?access_token=${accessToken}`);
      const data = await response.json();

      // Transform the data into the required format
      const characteristics = Object.keys(data).map(key => ({
        characteristic_name: key.charAt(0).toUpperCase() + key.slice(1), // Convert to capital case
        characteristic_score: data[key].toFixed(2) // Round to 2 decimal places
      }));

      this.setState({ characteristics });
    } catch (error) {
      console.error("Failed to fetch characteristics", error);
    }
  }

  render() {
    return (
      <div id="Characteristics">
        <h3>Characteristics</h3>
        <div className="characteristics-container">
          {this.state.characteristics.map((item) => (
            <div className="characteristic" key={item.characteristic_name}>
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
