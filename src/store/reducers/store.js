import { thunk } from 'redux-thunk'

//import { configureStore } from '@reduxjs/toolkit'
import { createStore, applyMiddleware } from "redux";
import reducers from "./index";

const store = createStore(reducers, applyMiddleware(thunk));

// const store = configureStore(reducers);

export default store;
