import { combineReducers } from "redux";

import api from "./features/apis/baseApi";

export default combineReducers({
  [api.reducerPath]: api.reducer,
});
