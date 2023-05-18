import { configureStore, combineReducers } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import undoable from 'redux-undo'

import pageEditorReducer from './pageEditorSlice'

const rootReducer = combineReducers({
  pageEditor: pageEditorReducer,
})

const undoableRootReducer = undoable(rootReducer)

export const store = configureStore({
  reducer: undoableRootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})
