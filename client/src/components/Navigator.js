import React, { Component } from "react";
import { ConnectedHome } from "./Home.js";
import { ConnectedLogin } from "./Login.js";
import { ConnectedRegistration } from "./Registration.js";
import { SideBar } from "./SideBar.js";
import { createDrawerNavigator, createAppContainer } from "react-navigation";

const Nav = createDrawerNavigator(
  {
    Home: { screen: ConnectedHome },
    Login: { screen: ConnectedLogin },
    Register: { screen: ConnectedRegistration }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);

export const Navigator = createAppContainer(Nav)