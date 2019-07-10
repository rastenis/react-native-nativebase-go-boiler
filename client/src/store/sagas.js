import { take, put } from "redux-saga/effects";
import axios from "axios";
import * as mutations from "./mutations";
import { NavigationActions } from 'react-navigation';
import { Alert } from 'react-native'

const url = `http://10.0.2.2:8080`;

axios.interceptors.request.use(request => {
  console.log("Starting Request", request);
  return request;
});

export function* authenticationSaga() {
  while (true) {
    const { email, password } = yield take(mutations.REQUEST_AUTH);
    try {
      const { data } = yield axios.post(`${url}/api/auth`, {
        email,
        password
      });

      yield put(mutations.processAuth(mutations.AUTHENTICATED));

      // requesting people
      yield put({
        type: mutations.REQUEST_PEOPLE
      });

      // request profile, etc.

      yield put(NavigationActions.navigate({ routeName: "Home" }))
    } catch (e) {
      Alert.alert("Error", e.response.data.Msg)
      yield put(mutations.processAuth(mutations.AUTH_ERROR));
    }
  }
}

export function* registrationSaga() {
  while (true) {
    const { email, password } = yield take(mutations.REQUEST_ACCOUNT_CREATION);
    try {
      const { data } = yield axios.post(`${url}/api/register`, {
        email,
        password
      });
      yield put(mutations.processAuth(mutations.AUTHENTICATED));

      yield put(NavigationActions.navigate({ routeName: "Home" }))
    } catch (e) {
      Alert.alert("Error", e.response.data.Msg)
      yield put(mutations.processAuth(mutations.AUTH_ERROR));
    }
  }
}

export function* sessionFetchSaga() {
  while (true) {
    yield take(mutations.REQUEST_SESSION_FETCH);
    try {
      const { data } = yield axios.get(`${url}/api/session`);
      yield put(mutations.setData(data.state));
      yield put(
        mutations.processAuth(data.auth ? mutations.AUTHENTICATED : null)
      );

      yield put(NavigationActions.navigate({ routeName: "Home" }))
    } catch (e) {
      Alert.alert("Error", "Couldn't reach server!")
    }
  }
}

export function* peopleFetchSaga() {
  while (true) {
    yield take(mutations.REQUEST_PEOPLE);
    try {
      const { data } = yield axios.get(`${url}/api/people`);
      yield put(mutations.setData({ people: data.people }));
    } catch (e) {
      Alert.alert("Error", "Couldn't fetch people!")
    }
  }
}

export function* logoutSaga() {
  while (true) {
    yield take(mutations.REQUEST_LOGOUT);
    try {
      yield axios.post(`${url}/api/logout`);
      yield put(mutations.clearState());
      yield put(mutations.processAuth(null));
      yield put(NavigationActions.navigate({ routeName: "Home" }))
    } catch (e) { Alert.alert("Error", "Couldn't log out!") }
  }
}
