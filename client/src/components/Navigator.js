import React, { Component } from "react";
import { Home } from "./Home.js";
import { Login } from "./Login.js";
import { SideBar } from "./SideBar.js";
import { createDrawerNavigator, createAppContainer } from "react-navigation";

const Nav = createDrawerNavigator(
  {
    Home: { screen: Home },
    Login: { screen: Login },
    // Register: { screen: Profile }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);

export const Navigator = createAppContainer(Nav)