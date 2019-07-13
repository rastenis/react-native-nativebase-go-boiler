import React, { Component } from "react";
import { WebView } from "react-native-webview";

export class ExternalLogin extends Component {
  render() {
    return <WebView source={{ uri: "/auth/google" }} />;
  }
}
