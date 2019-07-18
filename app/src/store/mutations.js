export const REQUEST_AUTH = `REQUEST_AUTH`;
export const REQUEST_AUTH_OTC = `REQUEST_AUTH_OTC`;
export const PROCESSING_AUTH = `PROCESSING_AUTH`;
export const AUTHENTICATING = `AUTHENTICATING`;
export const AUTHENTICATED = `AUTHENTICATED`;
export const AUTH_ERROR = `AUTH_ERROR`;
export const SET_DATA = `SET_DATA`;
export const CLEAR_DATA = `CLEAR_DATA`;
export const REQUEST_ACCOUNT_CREATION = `REQUEST_ACCOUNT_CREATION`;
export const REQUEST_SESSION_FETCH = `REQUEST_SESSION_FETCH`;
export const REQUEST_LOGOUT = `REQUEST_LOGOUT`;
export const REQUEST_PEOPLE = `REQUEST_PEOPLE`;
export const WAITING = `WAITING`;
export const REQUEST_AUTH_UNLINK = `REQUEST_AUTH_UNLINK`;
export const REQUEST_PASSWORD_CHANGE = `REQUEST_PASSWORD_CHANGE`;
export const REQUEST_USERDATA_FETCH = `REQUEST_USERDATA_FETCH`;

export const requestAuth = (email, password) => ({
  type: REQUEST_AUTH,
  email,
  password
});

export const requestAuthViaOTC = code => ({
  type: REQUEST_AUTH_OTC,
  code
});

export const processAuth = (status = AUTHENTICATING) => ({
  type: PROCESSING_AUTH,
  authenticated: status
});

export const requestLogout = () => ({
  type: REQUEST_LOGOUT
});

export const setData = (state = {}) => ({
  type: SET_DATA,
  data: state
});

export const clearData = () => ({
  type: CLEAR_DATA
});

export const requestAccountCreation = (email, password) => ({
  type: REQUEST_ACCOUNT_CREATION,
  email,
  password
});

export const requestPasswordChange = (oldPassword, newPassword) => ({
  type: REQUEST_PASSWORD_CHANGE,
  oldPassword,
  newPassword
});

export const requestAuthUnlink = toUnlink => ({
  type: REQUEST_AUTH_UNLINK,
  toUnlink
});
