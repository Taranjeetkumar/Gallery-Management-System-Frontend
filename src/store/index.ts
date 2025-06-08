import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import artistsReducer from "./slices/artistsSlice";
import artworksReducer from "./slices/artworksSlice";
import contactsReducer from "./slices/contactsSlice";
import staffReducer from "./slices/staffSlice";
import eventsReducer from "./slices/eventsSlice";
import galleryReducer from "./slices/gallerySlice";
import uploadReducer from "./slices/uploadSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  artists: artistsReducer,
  artworks: artworksReducer,
  contacts: contactsReducer,
  staff: staffReducer,
  events: eventsReducer,
  gallery: galleryReducer,
  upload: uploadReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
