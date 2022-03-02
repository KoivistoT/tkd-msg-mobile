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
import { navigationRef } from "../app/navigation/rootNavigation";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector, useStore } from "react-redux";
import MessageForm from "../app/components/MessageForm";
import Screen from "../app/components/Screen";
import { userLoggedOut } from "../store/currentUser";
import { getRoomMessagesByRoomId, sendMessage, test } from "../store/msgStore";
import { selectSocket } from "../store/socket";
import confirmAlert from "../utility/confirmAlert";
import MessageList from "../app/components/MessageList";
import AppButton from "../app/components/AppButton";
import {
  roomControlActivateRoom,
  roomControlArchiveRoom,
  roomControlDeleteRoom,
} from "../store/roomsControl";
import routes from "../app/navigation/routes";

function MessageScreen(item) {
  const nav = useNavigation();

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
    console.log(
      "kun private room niin setup sivulla eri sisältö, mutta sama setup komponentti"
    );

    // if (roomData.type === "private") {
    setHeader();
    // }
  }, []);

  const onDeleteRoom = async () => {
    const result = await confirmAlert("Haluatko poistaa huoneen?", "");
    if (!result) return;

    dispatch(roomControlDeleteRoom(roomData._id));
    navigationRef.current.goBack();
  };

  const onArchiveRoom = async () => {
    const result = await confirmAlert("Haluatko arkistoida huoneen?", "");
    if (!result) return;

    dispatch(roomControlArchiveRoom(roomData._id));
    navigationRef.current.goBack();
  };

  const onActivateRoom = async () => {
    const result = await confirmAlert("Haluatko aktivoida huoneen?", "");
    if (!result) return;

    dispatch(roomControlActivateRoom(roomData._id));
  };

  const setHeader = () => {
    nav.setOptions({
      headerRight: () => (
        <AppButton
          title={"setup"}
          onPress={() =>
            navigationRef.current.navigate(routes.ROOM_SETUP_SCREEN, roomData)
          }
        />

        //   <AppButton title={"delete"} onPress={() => onDeleteRoom()} />
        // ),

        // roomData.status === "active" ? (
        //   <AppButton title={"archive"} onPress={() => onArchiveRoom()} />
        // ) : (
        //   <AppButton title={"activate"} onPress={() => onActivateRoom()} />
      ),
    });
  };
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
