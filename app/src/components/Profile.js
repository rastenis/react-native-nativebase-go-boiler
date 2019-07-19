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
  Left,
  Right,
  Icon,
  Body,
  Title,
  H2,
  View
} from "native-base";
import { connect } from "react-redux";
import * as mutations from "../store/mutations";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Linking } from "expo";
import { url } from "../../../config.json";

const initialState = {
  oldPassword: "",
  newPassword: "",
  newPasswordConf: "",
  errors: []
};

class Profile extends Component {
  constructor(...args) {
    super(...args);

    this.state = initialState;
  }

  onChange = (name, text) => {
    this.setState({ [name]: text });
  };

  componentDidMount() {
    Linking.addEventListener("url", url => {
      this.handleAuthRedirect(url.url);
    });
    this.clear();
    this.props.navigation.addListener("willFocus", this.clear);
  }

  clear = () => {
    this.setState(initialState);
  };

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

    // not required to pass type here, because OAuth data is saved behind OTC anyway
    this.props.requestOAuthLink(params.code);
    return;
  };

  redirectToAuth = provider => {
    WebBrowser.openBrowserAsync(
      `${url}/auth/${provider}?redirectUrl=${Linking.makeUrl("/?")}`
    );
  };

  submitPasswordChange = () => {
    // clearing previous errors
    this.state.errors = [];

    // invalid password length
    if (
      this.state.newPassword.length < 5 ||
      this.state.newPassword.length > 100
    ) {
      this.setState(prevState => ({
        errors: [...prevState.errors, "password"]
      }));
      Alert.alert("Error", "Password must be between 5 and a 100 characters!");
      return;
    }

    // non-matching passwords
    if (this.state.newPassword != this.state.newPasswordConf) {
      this.setState(prevState => ({
        errors: [...prevState.errors, "password"]
      }));
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    this.props.requestPasswordChange(
      this.state.oldPassword,
      this.state.newPassword
    );
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          {this.props.hasPassword ? (
            <Form>
              <H2>Change Password</H2>
              <Label htmlFor="oldPasswordField">Old Password</Label>
              <Item error={this.state.errors.includes("password")}>
                <Input
                  id="oldPasswordField"
                  name="oldPassword"
                  secureTextEntry={true}
                  placeholder="Old Password"
                  onChangeText={this.onChange.bind(this, "oldPassword")}
                  value={this.state.oldPassword}
                />
              </Item>
              <Label htmlFor="newPasswordField">New Password</Label>
              <Item error={this.state.errors.includes("password")}>
                <Input
                  id="newPasswordField"
                  name="newPassword"
                  secureTextEntry={true}
                  placeholder="New Password"
                  onChangeText={this.onChange.bind(this, "newPassword")}
                  value={this.state.newPassword}
                />
              </Item>
              <Label htmlFor="newPasswordFieldConf">Confirm new password</Label>
              <Item error={this.state.errors.includes("password")}>
                <Input
                  id="newPasswordFieldConf"
                  name="newPasswordConf"
                  secureTextEntry={true}
                  placeholder="Confirm new password"
                  onChangeText={this.onChange.bind(this, "newPasswordConf")}
                  value={this.state.newPasswordConf}
                />
              </Item>
              <Button
                type="button"
                onPress={this.submitPasswordChange}
                full
                rounded
                light
                style={{ marginTop: 10 }}
              >
                <Text>Change password</Text>
              </Button>
            </Form>
          ) : null}
          <View>
            <H2>Manage linked accounts</H2>
            {this.props.Google ? (
              <Button
                danger
                disabled={!this.props.hasPassword}
                full
                onPress={() => this.requestUnlink()}
              >
                <Text>Unlink Google</Text>
              </Button>
            ) : (
              <Button
                full
                light
                onPress={this.redirectToAuth.bind(this, "google")}
              >
                <Text>Link Google</Text>
              </Button>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

const requestPasswordChange = (e, p) => {
  return mutations.requestPasswordChange(e, p);
};

const requestOAuthUnlink = () => {
  return mutations.requestAuthUnlink();
};

const requestOAuthLink = type => {
  return mutations.requestAuthLink(type);
};

const mapDispatchToProps = {
  requestPasswordChange,
  requestOAuthUnlink,
  requestOAuthLink
};

const mapStateToProps = ({ auth, data }) => ({
  auth: auth,
  Google: data.Google,
  hasPassword: data.hasPassword
});

export const ConnectedProfile = connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
