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
  // perform the mood algorithm
  moodAlgorithm = () => {
    const { mood_characteristics } = this.state;
    let valenceHigh = false;
    let energyHigh = false;
    let tempoHigh = false;
    const moods = [
      [{ mood: "Energetic" }, { color: "#FFF95D" }, {valence: "high"}, {energy: "high"}, {tempo: "high"}],
      [{ mood: "Happy" }, { color: "#FF9356" }, {valence: "high"}, {energy: "high"}, {tempo: "low"}],
      [{ mood: "Happy" }, { color: "#FF9356" }, {valence: "high"}, {energy: "low"}, {tempo: "high"}],
      [{ mood: "Calm" }, { color: "#C3C9DA" }, {valence: "high"}, {energy: "low"}, {tempo: "low"}],
      [{ mood: "Angry" }, { color: "#A20D0D" }, {valence: "low"}, {energy: "high"}, {tempo: "high"}],
      [{ mood: "Anxious" }, { color: "#306082" }, {valence: "low"}, {energy: "high"}, {tempo: "low"}],
      [{ mood: "Anxious" }, { color: "#306082" }, {valence: "low"}, {energy: "low"}, {tempo: "high"}],
      [{ mood: "Depressed" }, { color: "#000000" }, {valence: "low"}, {energy: "low"}, {tempo: "low"}]
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
      case (valenceHigh && energyHigh && !tempoHigh):
        mood = moods[1];
        break;
      case (valenceHigh && !energyHigh && tempoHigh):
        mood = moods[2];
        break;
      case valenceHigh && !energyHigh && !tempoHigh:
        mood = moods[3];
        break;
      case !valenceHigh && energyHigh && tempoHigh:
        mood = moods[4];
        break;
      case (!valenceHigh && energyHigh && !tempoHigh):
        mood = moods[5];
        break;
      case (!valenceHigh && !energyHigh && tempoHigh):
        mood = moods[6];
        break;
      case !valenceHigh && !energyHigh && !tempoHigh:
        mood = moods[7];
        break;
    }
    return mood;
  }
  // Render the mood algorithm's result
  render() {
    let mood_array = this.moodAlgorithm();
    let mood = mood_array[0];
    let color = mood_array[1];
    let valence = mood_array[2];
    let energy = mood_array[3];
    let tempo = mood_array[4];
    return (
      <div className="mood-container" style={{ backgroundColor: color.color }}>
        <h3 style={{ marginTop: "1rem"}}>Mood</h3>
        <p style={{ marginBottom: "2rem"}}><b>{mood.mood}</b></p>
        <p style={{ marginBottom: "2rem"}}>You recent listening history has had {valence.valence} valence, {energy.energy} energy, and {tempo.tempo} tempo</p>
      </div>
    )
  }
}

export default Characteristics;
