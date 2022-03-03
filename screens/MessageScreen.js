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
navigationRef;
import routes from "../app/navigation/routes";
import ScreenHeaderTitle from "../app/components/ScreenHeaderTitle";
import { getRoomMembersById } from "../store/rooms";

function MessageScreen(item) {
  const nav = useNavigation();

  const dispatch = useDispatch();
  const roomData = item.route.params;
  const roomMembers = useSelector(getRoomMembersById(roomData._id));
  useEffect(() => {
    // socket.emit("getUsers");
    // socket.on("users live", (data) => {
    //   setUsersLive(data.users);
    // });
    // return () => {
    //   socket.off("users live");
    // };c

    // if (roomData.type === "private") {
    setHeader();
    // }
  }, [roomMembers]);

  const setHeader = () => {
    nav.setOptions({
      headerTitle: () => (
        <ScreenHeaderTitle
          title={roomData.roomName}
          subTitle={`Members ${roomMembers.length} >`}
          action={() =>
            navigationRef.current.navigate(routes.ROOM_SETUP_SCREEN, roomData)
          }
        />
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
