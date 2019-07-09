import { Home } from "./Home"
import { Container } from 'native-base';
import React, { Component } from "react";
import { AppLoading } from "expo";
import * as Font from "expo-font"

export class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("../../../node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("../../../node_modules/native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <Container>
          <AppLoading />
        </Container>
      );
    }
    return (
      <Container>
        <Home />
      </Container>
    );
  }
}
