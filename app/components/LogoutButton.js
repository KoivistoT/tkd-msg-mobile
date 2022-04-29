import React from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useStore } from "react-redux";
import { selectCurrentUserId, userLoggedOut } from "../../store/currentUser";
import { generalStoreCleared } from "../../store/general";
import { msgStoreCleared } from "../../store/msgStore";
import { roomStoreCleared } from "../../store/rooms";
import { disconnectSocket, socketStoreCleared } from "../../store/socket";
import { usersStoreCleared } from "../../store/users";
import asyncStorageFuncs from "../../utility/asyncStorageFuncs";
import confirmAlert from "../../utility/confirmAlert";
import AppButton from "./AppButton";

function LogoutButton(props) {
  const store = useStore();
  const currentUserId = selectCurrentUserId(store);
  const dispatch = useDispatch();

  const logout = async () => {
    const result = await confirmAlert("Haluatko kirjauta ulos?", " ");
    if (!result) return;

    asyncStorageFuncs.setData("autoLogin", false);
    dispatch(disconnectSocket(currentUserId));
    dispatch(roomStoreCleared());
    dispatch(usersStoreCleared());
    dispatch(msgStoreCleared());
    dispatch(generalStoreCleared());
    dispatch(socketStoreCleared());
    dispatch(userLoggedOut());
  };

  return <AppButton onPress={() => logout()} title="Logout" />;
}

const styles = StyleSheet.create({
  container: {},
});

export default LogoutButton;
