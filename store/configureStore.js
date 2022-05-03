import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import toast from "./middleware/toast";
import api from "./middleware/api";

export default function () {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({ serializableCheck: false }),
      toast,
      api,
    ],
  });
}
