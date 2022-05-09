import firebaseConfig from "../config/firebaseConfig";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseStorage = () => {
  return getStorage(firebaseApp);
};

export const firebaseLogin = () => {
  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
      // Signed in..
    })
    .catch(() => {
      // ...
    });
};
