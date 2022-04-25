import React from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useStore } from "react-redux";
import { selectCurrentUserId, userLoggedOut } from "../../store/currentUser";
import { roomStateCleared } from "../../store/rooms";
import { disconnectSocket } from "../../store/socket";
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
    dispatch(roomStateCleared());
    dispatch(userLoggedOut());
  };

  return <AppButton onPress={() => logout()} title="Logout" />;
}

const styles = StyleSheet.create({
  container: {},
});

export default LogoutButton;
