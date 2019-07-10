import React, { Component } from "react";
import { Container, Header, Content, Label, Form, Item, Input, Button, Text, Left, Right, Icon, Body, Title } from 'native-base';
import { connect } from 'react-redux'
import * as mutations from "../store/mutations";

class Registration extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      email: "",
      password: "",
      passwordConf: ""
    };
  }

  onChange = (name, text) => {
    this.setState({ [name]: text });
  };

  submitRegistration = () => {
    this.props.requestRegistration(this.state.email, this.state.password);
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
                secureTextEntry={true}
                placeholder="Password"
                onChangeText={this.onChange.bind(this, "password")}
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
