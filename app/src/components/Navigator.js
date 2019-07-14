import React, { Component } from "react";
import { ConnectedHome } from "./Home.js";
import { ConnectedLogin } from "./Login.js";
import { ConnectedRegistration } from "./Registration.js";
import { ConnectedMain } from "./Main.js";
import { ConnectedSidebar } from "./SideBar.js";
import {
  createDrawerNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import { ExternalLogin } from "./ExternalLogin";

const Nav = createDrawerNavigator(
  {
    Home: { screen: ConnectedHome },
    Login: { screen: ConnectedLogin },
    Registration: { screen: ConnectedRegistration },
    Main: { screen: ConnectedMain }
  },
  {
    contentComponent: props => <ConnectedSidebar {...props} />,
    initialRouteName: "Home"
  }
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: Nav
    },
    ExternalLogin: {
      screen: ExternalLogin
    }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

export const Navigator = createAppContainer(RootStack);
