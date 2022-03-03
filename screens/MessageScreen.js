import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useDispatch, useSelector, useStore } from "react-redux";
import MessageForm from "../app/components/MessageForm";
import Screen from "../app/components/Screen";
import { userLoggedOut } from "../store/currentUser";
import { getRoomMessagesByRoomId, sendMessage, test } from "../store/msgStore";
import { selectSocket } from "../store/socket";
import confirmAlert from "../utility/confirmAlert";
import MessageList from "../app/components/MessageList";
import AppButton from "../app/components/AppButton";

import routes from "../app/navigation/routes";
import ScreenHeaderTitle from "../app/components/ScreenHeaderTitle";
import { getRoomMembersById } from "../store/rooms";

function MessageScreen(item) {
  const dispatch = useDispatch();
  const roomData = item.route.params;

  useEffect(() => {
    // socket.emit("getUsers");
    // socket.on("users live", (data) => {
    //   setUsersLive(data.users);
    // });
    // return () => {
    //   socket.off("users live");
    // };c
    // if (roomData.type === "private") {
    // setHeader();
    // }
  }, []);

  // const [usersLive, setUsersLive] = useState([]);

  return (
    <Screen>
      <MessageList item={item} />
      <MessageForm item={item} />
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default MessageScreen;
