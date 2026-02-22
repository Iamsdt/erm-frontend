import { combineReducers } from "redux"

import ct from "@constants/"

import app from "./slices/app.slice"
import project from "./slices/project.slice"
import theme from "./slices/theme.slice"
import user from "./slices/user.slice"

const rootReducer = combineReducers({
  [ct.store.APP_STORE]: app,
  [ct.store.USER_STORE]: user,
  [ct.store.THEME_STORE]: theme,
  [ct.store.PROJECT_STORE]: project,
})

export default rootReducer
