import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from "./Login"

export default function Layout() {
  return (
    <View style={styles.container}>
      {/* <Text>base layout</Text> */}
      <Login></Login>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
