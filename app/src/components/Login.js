import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Label,
  Form,
  Item,
  Input,
  Button,
  Text,
  Right,
  Body,
  Title,
  Icon
} from "native-base";
import * as mutations from "../store/mutations";
import { connect } from "react-redux";
import * as WebBrowser from "expo-web-browser";
import { Linking } from "expo";
import { url } from "../../../config.json";

class Login extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      email: "",
      password: ""
    };
  }

  componentDidMount() {
    Linking.addEventListener("url", url => {
      this.handleAuthRedirect(url.url);
    });
  }

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener("url", this.handleOpenURL);
  }

  handleAuthRedirect = url => {
    let params = {};
    url
      .split("/--/?")[1]
      .split("&")
      .forEach(queryItem => {
        let s = queryItem.split("=");
        params[s[0]] = s[1];
      });

    console.log(
      "Auth:",
      params.provider,
      "Status:",
      params.success,
      "OTC",
      params.code
    );

    this.props.authenticateUserViaOTC(params.code);

    return;
  };

  redirectToAuth = provider => {
    WebBrowser.openBrowserAsync(
      `${url}/auth/${provider}?redirectUrl=${Linking.makeUrl("/?")}`
    );
  };

  onChange = (name, text) => {
    this.setState({ [name]: text });
  };

  submitLogin = () => {
    this.props.authenticateUser(this.state.email, this.state.password);
  };

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Login</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Form>
            <Label htmlFor="emailField">Email</Label>
            <Item>
              <Input
                id="emailField"
                type="text"
                placeholder="Email"
                name="email"
                onChangeText={this.onChange.bind(this, "email")}
                value={this.state.email}
              />
            </Item>
            <Label htmlFor="passwordField">Password</Label>
            <Item last>
              <Input
                id="passwordField"
                name="password"
                secureTextEntry={true}
                placeholder="Password"
                onChangeText={this.onChange.bind(this, "password")}
                value={this.state.password}
              />
            </Item>
            <Button
              type="button"
              onPress={this.submitLogin}
              full
              rounded
              success
              style={{ marginTop: 10 }}
            >
              <Text>Log in</Text>
            </Button>
            <Button
              type="button"
              onPress={() => this.props.navigation.navigate("Registration")}
              full
              rounded
              primary
              style={{ marginTop: 10 }}
            >
              <Text>Don't have an account?</Text>
            </Button>
            <Button
              type="button"
              onPress={this.redirectToAuth.bind(this, "google")}
              full
              rounded
              light
              style={{ marginTop: 10 }}
            >
              <Icon name="logo-google" />
              <Text>Sign in with Google</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

const authenticateUser = (e, p) => {
  return mutations.requestAuth(e, p);
};

// using one time code to access oauth data stored in server
const authenticateUserViaOTC = code => {
  return mutations.requestAuthViaOTC(code);
};

const mapDispatchToProps = {
  authenticateUser,
  authenticateUserViaOTC
};

export const ConnectedLogin = connect(
  null,
  mapDispatchToProps
)(Login);
