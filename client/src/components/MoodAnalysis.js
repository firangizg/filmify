// This component performs the mood analysis algorithm
import React, { Component } from 'react';
import '../App.css';

class Characteristics extends Component {
  // Initialize the state
  state = {
    mood_characteristics: [],
  };
  // Fetch the characteristics from the backend
  async componentDidMount() {
    const { accessToken } = this.props;
    // Fetch the characteristics
    try {
      const selected_characteristics = [];
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/track-features?access_token=${accessToken}`);
      const data = await response.json();
      // Transform the data into the required format
      const characteristics = Object.keys(data).map(key => {
        const characteristic_name = key.charAt(0).toUpperCase() + key.slice(1); // Convert to capital case
        const characteristic_score = data[key].toFixed(2) // Round to 2 decimal places
        if (["valence", "tempo", "energy"].includes(key)) {
          // return { characteristic_name, characteristic_score };
          selected_characteristics.push({ characteristic_name, characteristic_score });
        } else {
          return null;
        }
      }).filter(Boolean);
      this.setState({ mood_characteristics: selected_characteristics });
    } catch (error) {
      console.error("Failed to fetch characteristics", error);
    }
  }
  moodAlgorithm = () => {
    const { mood_characteristics } = this.state;
    let valenceHigh = false;
    let energyHigh = false;
    let tempoHigh = false;
    const moods = [
      [{ mood: "Energetic" }, { color: "#FFF95D" }],
      [{ mood: "Happy" }, { color: "#FF9356" }],
      [{ mood: "Calm" }, { color: "#C3C9DA" }],
      [{ mood: "Angry" }, { color: "#A20D0D" }],
      [{ mood: "Sad/Anxious" }, { color: "#306082" }],
      [{ mood: "Depressed" }, { color: "#000000" }]
    ];
    let mood;
    mood_characteristics.forEach(characteristic => {
      switch(characteristic.characteristic_name) {
        case "Valence":
          if (parseFloat(characteristic.characteristic_score) > 0.5) {
            valenceHigh = true;
          }
          break;
        case "Energy":
          if (parseFloat(characteristic.characteristic_score) > 0.5) {
            energyHigh = true;
          }
          break;
        case "Tempo":
          if (parseFloat(characteristic.characteristic_score) > 120) {
            tempoHigh = true;
          }
          break;
        default:
          break;
      }
    });
    switch (true) {
      case valenceHigh && energyHigh && tempoHigh:
        mood = moods[0];
        break;
      case (valenceHigh && energyHigh && !tempoHigh) || (valenceHigh && !energyHigh && tempoHigh):
        mood = moods[1];
        break;
      case valenceHigh && !energyHigh && !tempoHigh:
        mood = moods[2];
        break;
      case !valenceHigh && energyHigh && tempoHigh:
        mood = moods[3];
        break;
      case (!valenceHigh && energyHigh && !tempoHigh) || (!valenceHigh && !energyHigh && tempoHigh):
        mood = moods[4];
        break;
      case !valenceHigh && !energyHigh && !tempoHigh:
        mood = moods[5];
        break;
    }
    return mood;
  }
  // Render the characteristics, if they exist
  // Display the characteristic name and score
  render() {
    let mood_array = this.moodAlgorithm();
    let mood = mood_array[0];
    let color = mood_array[1];
    return (
      <div className="mood-container" style={{ backgroundColor: color.color }}>
        <h3>Mood</h3>
        <p style={{ marginBottom: "2rem"}}><b>The overall mood of your listening history has been:</b> {mood.mood}</p>
      </div>
    )
  }
}

export default Characteristics;
