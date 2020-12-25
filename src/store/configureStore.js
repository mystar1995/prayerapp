import {applyMiddleware, createStore, compose} from 'redux';
import {logger} from 'redux-logger';
import {REHYDRATE, PURGE, persistStore} from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import immutableTransform from 'redux-persist-transform-immutable';
import rootReducer from './combineReducers';

const middlewares = [];

if (__DEV__ === true) {
	middlewares.push(logger);
}

middlewares.push(thunkMiddleware);

// const enhancer = compose(applyMiddleware(...middlewares));

export default function configureStore() {
	const store = createStore(
		rootReducer,
		undefined,
		compose(applyMiddleware(...middlewares)),
	);

	persistStore(store);

	return store;
}
