# react-native-nativebase-go-boiler

> A React-Native/Redux/Native-Base/Go full stack boilerplate for building Android and IOS apps.

Demo can be viewed [here.](#)

## Features

- Facebook Expo scaffolding, ejectable if desired.
- Barebones app structure + navigation setup with react-navigation
- User authentication either via email/password or via Google Sign-in. Expandable to accomodate other OAuth providers with golang/oauth2
- Redux + Redux-saga state management
- Go + gorilla/mux server, backed by MongoDB for storage
- [WIP] Guided setup
- [WIP] Tests


## Usage

```bash
# install dependencies
$ npm install

# build and serve to emulator/device with hot reload
$ npm run android
or 
$ npm run ios
```
## Building standalone apps
```bash
# login to Expo
$ expo login username password

# build app via Expo
$ npm build:android
or
$ npm build:ios

# built packages are accessible at https://expo.io/builds
# packages may be compiled locally if desired, use npm eject.
```

### Unguided key setup

* The process for obtaining a Google key is described [here](https://developers.google.com/identity/protocols/OAuth2).

### Information & sources

For detailed explanation on how things work, checkout [React Native docs.](https://facebook.github.io/react-native/docs/getting-started.html)

React docs can be found here: [React docs.](https://reactjs.org/docs/getting-started.html)

Read about Redux here [here](https://redux.js.org/introduction/getting-started) and about Redux-Saga [here.](https://redux-saga.js.org/)


