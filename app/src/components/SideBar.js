import React from "react";
import { FlatList } from "react-native";
import { Container, Content, Text, ListItem, Button } from "native-base";
import { connect } from "react-redux";
import * as mutations from "../store/mutations";

const routes = ["Main", "Profile"];
class SideBar extends React.Component {
  requestLogout() {
    this.props.logout();
  }

  render() {
    return (
      <Container>
        <Content>
          <FlatList
            data={routes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(item)}
                >
                  <Text>{item}</Text>
                </ListItem>
              );
            }}
          />
          <Button danger full onPress={() => this.requestLogout()}>
            <Text>Logout</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const logout = () => {
  return mutations.requestLogout();
};

const mapDispatchToProps = {
  logout
};

export const ConnectedSidebar = connect(
  null,
  mapDispatchToProps
)(SideBar);
