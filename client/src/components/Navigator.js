import React, { Component } from "react";
import { Home } from "./Home.js";
import { ConnectedLogin } from "./Login.js";
import { Register } from "./Register.js";
import { SideBar } from "./SideBar.js";
import { createDrawerNavigator, createAppContainer } from "react-navigation";

const Nav = createDrawerNavigator(
  {
    Home: { screen: Home },
    Login: { screen: ConnectedLogin },
    Register: { screen: Register }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);

export const Navigator = createAppContainer(Nav)