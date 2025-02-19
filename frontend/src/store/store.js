import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice.js";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Указываем, какие редьюсеры сохранять
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Отключаем проверку сериализуемости
    }),
});

export const persistor = persistStore(store);
