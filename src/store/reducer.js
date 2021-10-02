import { createStore } from "redux";
import boardReducer from "./boardReducer";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

const store = createStore(boardReducer, composeWithDevTools());

export default store;
