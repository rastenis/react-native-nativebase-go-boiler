import React, { Component } from "react";
import { Container, Header, Content, Label, Form, Item, Input, Button, Text, Left, Right, Icon, Body, Title } from 'native-base';

export class Login extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      email: "",
      password: ""
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitLogin = () => {
    // submit login
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
                onChange={this.onChange}
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
                onChange={this.onChange}
                value={this.state.password}
              />
            </Item>
            <Button
              type="button"
              onClick={this.submitLogin}
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
