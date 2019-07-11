import { createStore, applyMiddleware } from "redux";
import { reducer } from "./reducer";
import createSagaMiddleware from "redux-saga";
import * as sagas from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
);

for (let saga in sagas) {
  sagaMiddleware.run(sagas[saga]);
}

// TODO: async fetch session data when starting up.

export default store;
