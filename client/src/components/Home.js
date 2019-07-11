import React from "react";
import { Container, Header, Title, Right, Button, Body, Content, Text, Card, CardItem } from "native-base";
import { connect } from 'react-redux'

class Home extends React.Component {
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
          <Card>
            <CardItem>
              <Body>
                <Text>Log in to see user data.</Text>
              </Body>
            </CardItem>
          </Card>
          <Button full rounded primary
            style={{ marginTop: 10 }}
            onPress={() => this.props.navigation.navigate("Login")}>
            <Text>Go to login</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ data, auth }) => ({
  people: data.people,
  auth
});

export const ConnectedHome = connect(mapStateToProps)(Home)