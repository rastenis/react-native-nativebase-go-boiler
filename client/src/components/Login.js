import React, { Component } from "react";
import { Container, Header, Content, Label, Form, Item, Input, Button, Text, Left, Right, Icon, Body, Title } from 'native-base';
import * as mutations from "../store/mutations";
import { connect } from "react-redux";

class Login extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      email: "",
      password: ""
    };
  }

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
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Login</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Form>
            <Label htmlFor="emailField">
              Email
            </Label>
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
            <Label htmlFor="passwordField">
              Password
            </Label>
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
              full rounded success
              style={{ marginTop: 10 }}
            >
              <Text>Log in</Text>
            </Button>
            <Button
              type="button"
              onPress={() => this.props.navigation.navigate("Registration")}
              full rounded primary
              style={{ marginTop: 10 }}
            >
              <Text>Don't have an account?</Text>
            </Button>
          </Form>
        </Content>
      </Container >
    );
  }
}

const authenticateUser = (e, p) => {
  return mutations.requestAuth(e, p);
};

const mapDispatchToProps = {
  authenticateUser
};

export const ConnectedLogin = connect(
  null,
  mapDispatchToProps
)(Login);
