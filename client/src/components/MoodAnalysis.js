// This component performs the mood analysis algorithm
import React, { Component } from 'react';
import '../App.css';

class Characteristics extends Component {
  // Initialize the state
  state = {
    mood_characteristics: []
  };
  // Fetch the characteristics from the backend
  async componentDidMount() {
    const { accessToken } = this.props;
    // Fetch the characteristics
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/track-features?access_token=${accessToken}`);
      const data = await response.json();
      // Transform the data into the required format
      const characteristics = Object.keys(data).map(key => {
        const characteristic_name = key.charAt(0).toUpperCase() + key.slice(1); // Convert to capital case
        const characteristic_score = data[key].toFixed(2) // Round to 2 decimal places
        if (["valence", "tempo", "intensity"].includes(key)) {
          return { characteristic_name, characteristic_score };
        } else {
          return null;
        }
      }).filter(Boolean);
      this.setState({ mood_characteristics });
    } catch (error) {
      console.error("Failed to fetch characteristics", error);
    }
  }
  // Render the characteristics, if they exist
  // Display the characteristic name and score
  render() {
    moodAlgorithm = () => {
      const { mood_characteristics } = this.state;
      let valenceHigh = false;
      let intensityHigh = false;
      let tempoHigh = false;
      mood_characteristics.forEach(characteristic => {
        switch(characteristic.characteristic_name) {
          case "Valence":
            if (parseFloat(characteristic.characteristic_score) > 0.5) {
              valenceHigh = true;
            }
            break;
          case "Intensity":
            if (parseFloat(characteristic.characteristic_score) > 0.5) {
              intensityHigh = true;
            }
            break;
          case "Tempo":
            if (parseFloat(characteristic.characteristic_score) > 0.5) {
              tempoHigh = true;
            }
            break;
          default:
            break;
        }
      });
      switch (true) {
        case valenceHigh && intensityHigh && tempoHigh:
          console.log("Energetic\n");
          break;
        case (valenceHigh && intensityHigh && !tempoHigh) || (valenceHigh && !intensityHigh && tempoHigh):
          console.log("Happy\n");
          break;
        case valenceHigh && !intensityHigh && !tempoHigh:
          console.log("Calm\n");
          break;
        case !valenceHigh && intensityHigh && tempoHigh:
          console.log("Angry\n");
          break;
        case (!valenceHigh && intensityHigh && !tempoHigh) || (!valenceHigh && !intensityHigh && tempoHigh):
          console.log("Sad/Anxious\n");
          break;
        case !valenceHigh && !intensityHigh && !tempoHigh:
          console.log("Depressed\n");
          break;
      }
    }
    return (
      // <div id="Characteristics">
      //   <h3>Characteristics</h3>
      //   <div className="characteristics-container">
      //     {this.state.characteristics.map((item) => (
      //       <div className="characteristic" key={item.characteristic_name}>
      //         <h4>{item.characteristic_name}</h4>
      //         <p>{item.characteristic_score}</p>
      //       </div>
      //     ))}
      //   </div>
      // </div>
      <div>
        <h3>Mood = </h3>
        <p>Check console log</p>
      </div>
    )
  }
}

export default Characteristics;
