import sample from './testCharacteristicInput.json' assert { type: "json" };
import * as fs from 'fs';

let output = "";
let characteristics = "";

Object.entries(sample).forEach(([key, value]) => {
    if(key === "speechiness") {
        if(value < 0.1) {
            value = 1;
        } else if (value < 0.2) {
            value = 2;
        } else if (value < 0.33) {
            value = 3;
        } else if (value < 0.66) {
            value = 4;
        } else {
            value = 5;
        }
    } else if (key === "loudness") {
        if(value < -40) {
            value = 1;
        } else if (value < -25) {
            value = 2;
        } else if (value < -15) {
            value = 3;
        } else if (value < -5) {
            value = 4;
        } else {
            value = 5;
        }
    } else {
        if(value < 0.2) {
            value = 1;
        } else if (value < 0.4) {
            value = 2;
        } else if (value < 0.6) {
            value = 3;
        } else if (value < 0.8) {
            value = 4;
        } else {
            value = 5;
        }
    }
    if(key === "liveness") {
        output += key;
        characteristics += value;
    } else {
        output += key + ",";
        characteristics += value + ',';
    }
})

output += "\n" + characteristics;

fs.writeFile('single_test_data.csv', output, err => {
    if (err) {
        console.error(err);
    } else {
        console.log("Characteristics written to file")
    }
});