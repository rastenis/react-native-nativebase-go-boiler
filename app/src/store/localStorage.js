import { AsyncStorage } from "react-native";

export const storeSession = async function(session) {
  try {
    await AsyncStorage.setItem("session", session);
  } catch (error) {
    console.error(error);
  }
};

export const fetchSession = async function() {
  try {
    let s = await AsyncStorage.getItem("session");
    return s;
  } catch (error) {
    console.error(error);
  }
};
