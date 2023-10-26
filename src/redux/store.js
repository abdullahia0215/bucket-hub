import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import rootReducer from './reducers/_root.reducer'; 
import rootSaga from './sagas/_root.saga';

const sagaMiddleware = createSagaMiddleware();

// Middleware configuration
const middlewareList = process.env.NODE_ENV === 'development' ?
  [sagaMiddleware, logger] :
  [sagaMiddleware];

// Redux-persist configuration
const persistConfig = {
  key: 'root',
  storage,
  // You can add additional configuration options here
  // For instance, if you want to persist only a specific reducer:
  // whitelist: ['someSpecificReducer']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer and middleware
const store = createStore(
  persistedReducer,
  applyMiddleware(...middlewareList),
);

// Run sagas
sagaMiddleware.run(rootSaga);

// Create persistor to manage the storage synchronization
const persistor = persistStore(store);

export { store, persistor };
