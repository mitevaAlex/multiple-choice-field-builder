import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, REHYDRATE, PERSIST } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import formDataReducer from "./formDataSlice";

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  formDataSlice: formDataReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [REHYDRATE, PERSIST], 
      },
    }),
});

export const persistor = persistStore(store);
