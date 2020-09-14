import React, { Component } from "react";
import { StyleSheet, Text, SafeAreaView, Animated, Easing } from "react-native";
import * as Location from "expo-location";

export default class CompassScreen extends Component {
  constructor() {
    super();
    this.state = {
      errorMessage: "",
      magHeading: null,
    };
    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();

    if (status !== "granted") {
      this.setState({
        errorMessage:
          "Access denied! In order to use this app, you have to allow Location access.",
      });
    } else {
      Location.watchHeadingAsync((obj) => {
        let magHeading = obj.magHeading;
        this.setState({ magHeading });
        this.startSpinning();
      });
    }
  };

  startSpinning = () => {
    let start = JSON.stringify(this.spinValue);
    let heading = Math.round(this.state.magHeading);

    start += heading;

    Animated.timing(this.spinValue, {
      toValue: start,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  render() {
    let text = "";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.magHeading) {
      let roundedHeading = Math.round(this.state.magHeading);
      if (roundedHeading >= 0 && roundedHeading < 22.5) {
        text = roundedHeading + "°" + " " + "N";
      }
      if (roundedHeading >= 22.5 && roundedHeading < 67.5) {
        text = roundedHeading + "°" + " " + "NE";
      }
      if (roundedHeading >= 67.5 && roundedHeading < 112.5) {
        text = roundedHeading + "°" + " " + "E";
      }
      if (roundedHeading >= 112.5 && roundedHeading < 157.5) {
        text = roundedHeading + "°" + " " + "SE";
      }
      if (roundedHeading >= 157.5 && roundedHeading < 202.5) {
        text = roundedHeading + "°" + " " + "S";
      }
      if (roundedHeading >= 202.5 && roundedHeading < 247.5) {
        text = roundedHeading + "°" + " " + "SW";
      }
      if (roundedHeading >= 247.5 && roundedHeading < 292.5) {
        text = roundedHeading + "°" + " " + "W";
      }
      if (roundedHeading >= 292.5 && roundedHeading < 337.5) {
        text = roundedHeading + "°" + " " + "NW";
      }
      if (roundedHeading >= 337.5 && roundedHeading < 360.0) {
        text = roundedHeading + "°" + " " + "N";
      }
    }

    const spin = this.spinValue.interpolate({
      inputRange: [0, 360],
      outputRange: ["-0deg", "-360deg"],
    });
    return (
      <SafeAreaView style={styles.container}>
        <Animated.Image
          style={{
            width: 350,
            height: 350,
            transform: [{ rotate: spin }],
          }}
          source={require("../assets/compass.png")}
        ></Animated.Image>
        <Text style={styles.text}>{text}</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
    fontSize: 45,
    lineHeight: 45,
    paddingTop: 50,
  },
});
