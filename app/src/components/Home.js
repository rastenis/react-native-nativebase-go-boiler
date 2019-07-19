import React from "react";
import {
  Container,
  Header,
  Title,
  Right,
  Button,
  Body,
  Content,
  Text,
  H2,
  View
} from "native-base";
import { connect } from "react-redux";
import * as mutations from "../store/mutations";

class Home extends React.Component {
  componentDidUpdate() {
    if (this.props.auth === mutations.AUTHENTICATED) {
      this.props.navigation.navigate("Main");
    }
  }

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Boiler</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <View>
            <H2>Welcome!</H2>
            <Text>Log in to see people list.</Text>
          </View>
          <Button
            full
            rounded
            primary
            style={{ marginTop: 10 }}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text>Go to login</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

export const ConnectedHome = connect(mapStateToProps)(Home);
