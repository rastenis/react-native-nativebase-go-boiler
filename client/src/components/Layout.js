import React from 'react';
import { Login } from "./Login"
import { Container } from 'native-base';

export default function Layout() {
  return (
    <Container>
      {/* <Text>base layout</Text> */}
      <Login></Login>
    </Container>
  );
}
