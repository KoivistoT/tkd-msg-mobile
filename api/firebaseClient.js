import firebaseConfig from "../config/firebaseConfig";
import { getAuth, signInAnonymously } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

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
    .catch((error) => {
      // ...
    });
};
