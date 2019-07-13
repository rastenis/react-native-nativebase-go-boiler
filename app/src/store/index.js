import { createStore, applyMiddleware } from "redux";
import { reducer } from "./reducer";
import createSagaMiddleware from "redux-saga";
import * as sagas from "./sagas";
import * as mutations from "./mutations";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer, applyMiddleware(sagaMiddleware));

for (let saga in sagas) {
  sagaMiddleware.run(sagas[saga]);
}

store.dispatch({ type: mutations.REQUEST_SESSION_FETCH });

export default store;
