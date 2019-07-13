import React from "react";
import { Container, Content, Text, List, ListItem, Button } from "native-base";
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
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(data)}
                >
                  <Text>{data}</Text>
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
