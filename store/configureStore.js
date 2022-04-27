import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import toast from "./middleware/toast";
import api from "./middleware/api";
// import init from "./middleware/init";

export default function () {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({ serializableCheck: false }),
      toast,
      api,
      // init,
    ],
  });
}
