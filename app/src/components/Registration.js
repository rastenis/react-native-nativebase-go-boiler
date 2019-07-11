import React, { Component } from "react";
import { Container, Header, Content, Label, Form, Item, Input, Button, Text, Left, Right, Icon, Body, Title } from 'native-base';
import { connect } from 'react-redux'
import * as mutations from "../store/mutations";
import { Alert } from "react-native";

class Registration extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      email: "",
      password: "",
      passwordConf: "",
      errors: []
    };
  }

  onChange = (name, text) => {
    this.setState({ [name]: text });
  };

  submitRegistration = () => {
    // clearing previous errors
    this.state.errors = [];

    // validation
    if (!/\S+@\S+\.\S+/.test(this.state.email)) {
      this.setState(prevState => ({
        errors: [...prevState.errors, "email"]
      }))
      Alert.alert("Error", "Invalid email address!");
      return;
    }

    // invalid password length
    if (this.state.password.length < 5 || this.state.password.length > 100) {
      this.setState(prevState => ({
        errors: [...prevState.errors, "password"]
      }))
      Alert.alert("Error", "Password must be between 5 and a 100 characters!");
      return;
    }

    // non-matching passwords
    if (this.state.password != this.state.passwordConf) {
      this.setState(prevState => ({
        errors: [...prevState.errors, "password"]
      }))
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
              onPress={() => this.props.navigation.navigate("Login")}>
              <Icon name="md-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Register</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Form>
            <Label htmlFor="emailField">
              Email
            </Label>
            <Item error={this.state.errors.includes("email")}>
              <Input
                id="emailField"
                type="text"
                placeholder="Email"
                name="email"
                onChangeText={this.onChange.bind(this, "email")}
                value={this.state.email}
              />
            </Item>
            <Label htmlFor="passwordField">
              Password
            </Label>
            <Item error={this.state.errors.includes("password")}>
              <Input
                id="passwordField"
                name="password"
                secureTextEntry={true}
                placeholder="Password"
                onChangeText={this.onChange.bind(this, "password")}
                value={this.state.password}
              />
            </Item>
            <Label htmlFor="passwordField">
              Confirm password
            </Label>
            <Item error={this.state.errors.includes("password")}>
              <Input
                id="passwordConfField"
                name="passwordConf"
                secureTextEntry={true}
                placeholder="Confirm password"
                onChangeText={this.onChange.bind(this, "passwordConf")}
                value={this.state.passwordConf}
              />
            </Item>
            <Button
              type="button"
              onPress={this.submitRegistration}
              full rounded info
              style={{ marginTop: 10 }}
            >
              <Text>Register</Text>
            </Button>
          </Form>
        </Content>
      </Container >
    );
  }
}

const requestRegistration = (e, p) => {
  return mutations.requestAccountCreation(e, p);
};

const mapDispatchToProps = {
  requestRegistration
};

export const ConnectedRegistration = connect(
  null,
  mapDispatchToProps
)(Registration);
