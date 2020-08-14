import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Expo from 'expo';

export default class App extends Component {
  state = {
    location: null,
  };

  _getLocationAsync = async () => {
    let { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
    if (status !== 'granted') {
      console.error('Location permission not granted!');
      return;
    }

    let location = await Expo.Location.getCurrentPositionAsync({});

    let eliotHouse = (await Expo.Location.geocodeAsync('101 Dunster St.'))[0];
    let theCrimson = (await Expo.Location.geocodeAsync('14 Plympton St.'))[0];
    let theKitty = (await Expo.Location.geocodeAsync('2 Holyoke Place'))[0];
    
    let where = (await Expo.Location.reverseGeocodeAsync(location.coords))[0];
    console.log(where);

    this.setState({
      location,
      places: {
        eliotHouse,
        theCrimson,
        theKitty,
        
      },
      where,
    });
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  render() {
    if (!this.state.location) {
      return <View />;
    }
    return (
      <Expo.MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: this.state.location.coords.latitude,
          longitude: this.state.location.coords.longitude,
          latitudeDelta: 0.0922 / 2.5,
          longitudeDelta: 0.0421 / 2.5,
        }}>
        <Expo.MapView.Marker
          coordinate={this.state.location.coords}
          title="You are here"
          description={this.state.where.name}
          pinColor="green"
        />
        <Expo.MapView.Marker
          coordinate={this.state.places.eliotHouse}
          title="Eliot House"
          description="Domus"
          pinColor="blue"
        />

        <Expo.MapView.Marker
          coordinate={this.state.places.theCrimson}
          title="The Crimson"
          description="Student Newspaper"
          pinColor="crimson"
        />
        

        <Expo.MapView.Marker
          coordinate={this.state.places.theKitty}
          title="The Kitty"
          description="meow"
          pinColor="black"
        />

      </Expo.MapView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Expo.Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
