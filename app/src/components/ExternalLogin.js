import React, { Component } from "react";
import { WebView } from "react-native-webview";
import { Container } from "native-base";
import { url } from "../../../config.json";

export class ExternalLogin extends Component {
  render() {
    return (
      <Container>
        <WebView source={{ uri: `${url}/auth/google` }} />
      </Container>
    );
  }
}
