import { applyMiddleware, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import persistedReducer from './reducer';
import { thunk } from 'redux-thunk';

const store = createStore(
  persistedReducer,
  applyMiddleware(thunk),
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const persistor = persistStore(store);

export { store, persistor };