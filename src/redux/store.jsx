import { createStore, combineReducers } from "redux";
import authReducer from "./user";

const rootReducer = combineReducers({
    auth: authReducer,
});

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // 개발자 도구용
);

export default store;