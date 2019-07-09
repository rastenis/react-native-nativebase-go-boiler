import React, { Component } from "react";
import { Container, Header, Content, Label, Form, Item, Input, Button, Text, Left, Right, Icon, Body, Title } from 'native-base';
import * as mutations from "../store/mutations";
import { connect } from "react-redux";

export class Login extends Component {
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
            <Item>
              <Input
                id="passwordField"
                name="password"
                type="password"
                placeholder="Password"
                onChangeText={this.onChange.bind(this, "password")}
                value={this.state.password}
              />
            </Item>
            <Button
              type="button"
              onPress={this.submitLogin}
              full rounded primary
              style={{ marginTop: 10 }}
            >
              <Text>Submit</Text>
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

const mapStateToProps = ({ auth }) => ({
  auth
});

const mapDispatchToProps = {
  authenticateUser
};

export const ConnectedLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
