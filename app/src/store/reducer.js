import { combineReducers } from "redux";
import * as mutations from "./mutations";

let defaultState = {
  data: { people: mutations.WAITING, hasPassword: null, google: null },
  auth: mutations.WAITING
};

export const reducer = combineReducers({
  data(d = defaultState.data, action) {
    let { type, data } = action;
    switch (type) {
      case mutations.SET_DATA:
        return { ...d, ...data };
      case mutations.CLEAR_DATA:
        return {};
      default:
        return d;
    }
  },
  auth(userAuth = defaultState.auth, action) {
    let { type, authenticated } = action;
    switch (type) {
      case mutations.REQUEST_AUTH:
        return mutations.AUTHENTICATING;
      case mutations.PROCESSING_AUTH:
        return authenticated;
      default:
        return userAuth;
    }
  }
});
