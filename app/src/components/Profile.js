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
  Title
} from "native-base";
import { connect } from "react-redux";
import * as mutations from "../store/mutations";
import { Alert } from "react-native";

class Profile extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      oldPassword: "",
      newPassword: "",
      newPasswordConf: "",
      errors: []
    };
  }

  onChange = (name, text) => {
    this.setState({ [name]: text });
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

    this.props.requestRegistration(this.state.email, this.state.password);
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
          <Card>
            <CardItem>
              <Body>
                <Text>Change password.</Text>
              </Body>
            </CardItem>
          </Card>
          <Form>
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
        </Content>
      </Container>
    );
  }
}

const requestPasswordChange = (e, p) => {
  return mutations.requestAccountCreation(e, p);
};

const mapDispatchToProps = {
  requestPasswordChange
};

const mapStateToProps = ({ auth, data }) => ({
  auth: auth,
  google: data.google,
  hasPassword: data.hasPassword
});

export const ConnectedProfile = connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
