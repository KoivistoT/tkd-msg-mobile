import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import toast from "./middleware/toast";
import api from "./middleware/api";
import socket from "./middleware/socket";

export default function () {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({ serializableCheck: false }),

      // logger("console"),
      toast,
      api,
      socket,
    ],
  });
}
