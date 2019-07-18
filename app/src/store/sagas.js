import { take, put } from "redux-saga/effects";
import axios from "axios";
import * as mutations from "./mutations";
import { Alert } from "react-native";
import NavigationService from "../components/NavigationService";
import { fetchSession, storeSession } from "./localStorage";
import { url } from "../../../config.json";

// use this as a lightweight way to inspect outgoing requests.
// axios.interceptors.request.use(request => {
//   console.log("Starting Request", request);
//   return request;
// });

export function* authenticationSaga() {
  while (true) {
    const { email, password } = yield take(mutations.REQUEST_AUTH);
    try {
      const { headers } = yield axios.post(`${url}/api/auth`, {
        email,
        password
      });

      // storing session locally.
      yield storeSession(headers["set-cookie"][0]);

      yield put(mutations.processAuth(mutations.AUTHENTICATED));

      // requesting people
      yield put({
        type: mutations.REQUEST_PEOPLE
      });

      // getting profile data (for profile page)
      yield put({
        type: mutations.REQUEST_USERDATA_FETCH
      });

      // request profile, etc.
      NavigationService.navigate("Main");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", e.response.data.Msg || "Could not log in.");
      yield put(mutations.processAuth(mutations.AUTH_ERROR));
    }
  }
}

export function* OTCAuthenticationSaga() {
  while (true) {
    const { code } = yield take(mutations.REQUEST_AUTH_OTC);
    try {
      const { headers } = yield axios.post(`${url}/api/authOTC`, {
        code
      });

      // storing session locally.
      yield storeSession(headers["set-cookie"][0]);

      yield put(mutations.processAuth(mutations.AUTHENTICATED));

      // getting profile data (for profile page)
      yield put({
        type: mutations.REQUEST_USERDATA_FETCH
      });

      // requesting people
      yield put({
        type: mutations.REQUEST_PEOPLE
      });

      NavigationService.navigate("Main");
    } catch (e) {
      Alert.alert(
        "Error",
        e.response.data.Msg || "Could not login via one time code."
      );
      console.log(e);
      yield put(mutations.processAuth(mutations.AUTH_ERROR));
    }
  }
}

export function* registrationSaga() {
  while (true) {
    const { email, password } = yield take(mutations.REQUEST_ACCOUNT_CREATION);
    try {
      yield axios.post(`${url}/api/register`, {
        email,
        password
      });
      yield put(mutations.processAuth(mutations.AUTHENTICATED));

      // no need to fetch full session data, because accounts created via /api/register are always password based and never have oauth tokens.
      // setting default value
      yield put(
        mutations.setData({
          Google: false,
          hasPassword: true
        })
      );

      NavigationService.navigate("Main");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.response.data.Msg || "Could not register.");
      yield put(mutations.processAuth(mutations.AUTH_ERROR));
    }
  }
}

export function* sessionFetchSaga() {
  while (true) {
    yield take(mutations.REQUEST_SESSION_FETCH);
    try {
      // attempt to fetch local session token
      const storedSession = yield fetchSession();

      if (storedSession) {
        // set cookie
        axios.defaults.headers["set-cookie"] = storedSession;
      }

      const { data } = yield axios.get(`${url}/api/session`);

      yield put(
        mutations.processAuth(data.Auth ? mutations.AUTHENTICATED : null)
      );

      // setting user data
      yield put(
        mutations.setData({
          Google: data.Google,
          hasPassword: data.HasPassword
        })
      );

      if (data.Auth) {
        yield put({
          type: mutations.REQUEST_PEOPLE
        });
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Couldn't reach server!");
    }
  }
}

// minfied sessionFetchSaga, just for user data.
export function* userDataFetchSaga() {
  while (true) {
    yield take(mutations.REQUEST_USERDATA_FETCH);
    try {
      const { data } = yield axios.get(`${url}/api/session`);

      // setting user data
      yield put(
        mutations.setData({
          Google: data.Google,
          hasPassword: data.HasPassword
        })
      );
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Couldn't reach server!");
    }
  }
}

export function* peopleFetchSaga() {
  while (true) {
    yield take(mutations.REQUEST_PEOPLE);
    try {
      const { data } = yield axios.get(`${url}/api/people`);
      yield put(mutations.setData({ people: data.People }));
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Couldn't fetch people!");
    }
  }
}

export function* unlinkOAuthSaga() {
  while (true) {
    yield take(mutations.REQUEST_AUTH_UNLINK);
    try {
      yield axios.post(`${url}/unlink/google`);
      yield put(mutations.setData({ Google: false }));
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Couldn't unlink auth!");
    }
  }
}

export function* logoutSaga() {
  while (true) {
    yield take(mutations.REQUEST_LOGOUT);
    try {
      yield axios.post(`${url}/api/logout`);
      yield put(mutations.clearData());
      yield put(mutations.processAuth(null));
      NavigationService.navigate("Home");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Couldn't log out!");
    }
  }
}

export function* passwordChangeSaga() {
  while (true) {
    const { oldPassword, newPassword } = yield take(
      mutations.REQUEST_PASSWORD_CHANGE
    );
    try {
      yield axios.post(`${url}/api/changePassword`, {
        oldPassword,
        newPassword
      });
      Alert.alert("Success!", "Password changed successfully!");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.response.data.Msg);
      yield put(mutations.processAuth(mutations.AUTH_ERROR));
    }
  }
}
