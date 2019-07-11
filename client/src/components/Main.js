import React from "react";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem } from "native-base";
import { connect } from 'react-redux'
import * as mutations from '../store/mutations'

class Main extends React.Component {
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
            <Title>Boiler</Title>
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
                  <Text>You are not authenticated.</Text>
                </Body> {/* TODO: auto redirect to Home */}
              </CardItem>}
          </Card>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ data, auth }) => ({
  people: data.people,
  auth
});

export const ConnectedMain = connect(mapStateToProps)(Main)