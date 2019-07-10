import React from "react";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem } from "native-base";
import { connect } from 'react-redux'
import * as mutations from '../store/mutations'

class Home extends React.Component {
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
            <Title>Home</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Text style={{ textAlign: "center" }}>People list:</Text>
          <Card>
            {this.props.auth == mutations.AUTHENTICATED && this.props.people ? this.props.people.map((person, index) => {
              return (<CardItem key={index}>
                <Body>
                  <Text>{person.Name}</Text>
                </Body>
              </CardItem>)
            }) : <CardItem>
                <Body>
                  <Text>Sign in to see user data.</Text>
                </Body>
              </CardItem>}
          </Card>
          <Button full rounded primary
            style={{ marginTop: 10 }}
            onPress={() => this.props.navigation.navigate("Login")}>
            <Text>Go To Login</Text>
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