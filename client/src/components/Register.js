import React, { Component } from "react";
import { Container, Header, Content, Label, Form, Item, Input, Button, Text, Left, Right, Icon, Body, Title } from 'native-base';

export class Register extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      email: "",
      password: "",
      passwordConf: ""
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitRegistration = () => {
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
            <Title>Register</Title>
          </Body>
          <Right />
        </Header>
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
              <Label htmlFor="passwordField">
                Confirm password
            </Label>
            </Item>
            <Item>
              <Input
                id="passwordConfField"
                name="passwordConf"
                type="password"
                placeholder="Confirm password"
                onChange={this.onChange}
                value={this.state.passwordConf}
              />
            </Item>
            <Item>
              <Button
                type="button"
                onClick={this.submitLogin}
                info
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
