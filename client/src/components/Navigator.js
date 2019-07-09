import React, { Component } from "react";
import { Home } from "./Home.js";
import { Login } from "./Login.js";
import { SideBar } from "./SideBar.js";
import { DrawerNavigator } from "react-navigation";

export default Navigator = DrawerNavigator(
  {
    Home: { screen: Home },
    Login: { screen: Login },
    // Register: { screen: Profile }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);
