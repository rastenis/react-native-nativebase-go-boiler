import { take, put } from "redux-saga/effects";
import axios from "axios";
import * as mutations from "./mutations";
import { NavigationActions } from 'react-navigation';

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

      yield put(mutations.setState(data.state));
      yield put(mutations.processAuth(mutations.AUTHENTICATED));

      yield put({
        type: mutations.REQUEST_SESSION_FETCH
      });
      yield put(NavigationActions.navigate({ routeName: "Home" }))
    } catch (e) {
      console.log(e);
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
      yield put(mutations.setState(data.state));
      yield put(mutations.processAuth(mutations.AUTHENTICATED));

      yield put(NavigationActions.navigate({ routeName: "Home" }))
    } catch (e) {
      // TODO: set error message
      yield put(mutations.processAuth(mutations.AUTH_ERROR));
    }
  }
}

export function* sessionFetchSaga() {
  while (true) {
    yield take(mutations.REQUEST_SESSION_FETCH);
    try {
      const { data } = yield axios.get(`${url}/api/data`);
      yield put(mutations.setState(data.state));
      yield put(
        mutations.processAuth(data.auth ? mutations.AUTHENTICATED : null)
      );

      yield put(NavigationActions.navigate({ routeName: "Home" }))
    } catch (e) {
      // no conncetion to backend
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
    } catch (e) { }
  }
}
