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
            <Label htmlFor="passwordField">
              Confirm password
            </Label>
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
            <Button
              type="button"
              onClick={this.submitLogin}
              full rounded info
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
