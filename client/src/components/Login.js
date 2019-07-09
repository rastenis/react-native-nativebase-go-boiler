import React, { Component } from "react";
import { Container, Header, Content, Label, Form, Item, Input, Button, Text } from 'native-base';

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
        <Header />
        <Content>
          <Form>
            <Item>
              <Label htmlFor="emailField">
                Email
            </Label>
            </Item>

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
            <Item>
              <Label htmlFor="passwordField">
                Password
            </Label>
            </Item>
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
            <Item>
              <Button
                type="button"
                onClick={this.submitLogin}
                primary
                style={{ width: "100%" }}
              >
                <Text>Submit</Text>
              </Button>
            </Item>
          </Form>
        </Content>
      </Container >
    );
  }
}
