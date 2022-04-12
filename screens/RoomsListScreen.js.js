import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  AppState,
} from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import Screen from "../app/components/Screen";
import * as DocumentPicker from "expo-document-picker";
import {
  tasksCleared,
  getTasks,
  selectTasks,
  userLoggedOut,
} from "../store/currentUser";
import { WebView } from "react-native-webview";
import { useIsFocused } from "@react-navigation/native";
import {
  createSocketConnection,
  disconnectSocket,
  selectSocket,
} from "../store/socket";
import { MemoRoomListItemMain } from "../app/components/RoomListItemMain";
import {
  notificationResponseCleared,
  roomLatestMessageChanged,
  roomStateCleared,
  selectAllActiveRoomsIds,
  selectAllActiveRoomsIdsOld,
  selectNotificationResponse,
  selectRoomsFetched,
} from "../store/rooms";
import { MemoNewDirectRoomModal } from "../app/components/modals/NewDirectRoomModal";
import { MemoCreateChannelModal } from "../app/components/modals/CreateChannelModal";
import { usersOnlineResived } from "../store/users";
import {
  messagesFromStorageFetched,
  newMessageResived,
  roomMessagesMoveToStorage,
  selectMessageById,
} from "../store/msgStore";
import { LogBox } from "react-native";
import messagesApi from "../api/messages";
import AppText from "../app/components/AppText";
import asyncStorageFuncs from "../utility/asyncStorageFuncs";
import ShowDocumentModal from "../app/components/modals/SelectDocumentModal";
import ListItemSeparator from "../app/components/ListItemSeparator";
import { messageSelectionRemoved } from "../store/general";
function RoomsListScreen({ navigation }) {
  const dispatch = useDispatch();
  const store = useStore();
  const socket = useSelector(selectSocket);
  const isFocused = useIsFocused();
  const currentUserId = store.getState().auth.currentUser._id;
  const currentUserRooms = store.getState().auth.currentUser.userRooms;
  // const allActiveRoomsIds = useSelector(selectAllActiveRoomsIdsOld);
  const allActiveRoomsIds = useSelector(selectAllActiveRoomsIds);
  const roomsFetched = useSelector(selectRoomsFetched);
  // const tasks = useSelector(selecttasks);

  // if (tasks && tasks.length !== 0) {
  //   console.log(tasks);
  //   if (tasks && tasks.length !== 0) {
  //     console.log("täällä nyt toimii");
  //     tasks.forEach((element) => {
  //       const { type, data } = element;
  //       console.log(type, "tämä on type");
  //       if (type === "new message") {
  //         dispatch(newMessageResived(data));
  //       }
  //       if (type === "roomLatestMessageChanged") {
  //         dispatch(roomLatestMessageChanged(data));
  //       }
  //     });
  //     dispatch(tasksCleared());
  //   }
  // }

  const logout = () => {
    // userOffline();

    asyncStorageFuncs.setData("autoLogin", false);
    dispatch(disconnectSocket());
    dispatch(roomStateCleared());
    dispatch(userLoggedOut());
  };

  const userOnline = () => {
    socket.emit("userOnline", currentUserId);
    socket.on("userOnline", (data) => {
      dispatch(usersOnlineResived(data));
    });
  };

  const userOffline = () => {
    socket.emit("userOffline", currentUserId);
    socket.off("userOnline");
  };

  // var counter = 0;
  // var i = setInterval(async function () {
  //   dispatch(getTasks(currentUserId));
  //   counter++;
  //   if (counter === 100) {
  //     clearInterval(i);
  //   }
  // }, 5000);
  // console.log("tämä päivittyy kanssa");

  const socketConnection = useRef(true);
  const handleChange = (newState) => {
    if (newState === "active") {
      // console.log("taas actiivinen");
      // dispatch(getTasks(currentUserId));

      if (!socket) {
        dispatch(createSocketConnection());
        socketConnection.current = true;
      }

      // userOnline();
    } else if (newState === "background" || newState === "inactive") {
      // userOffline();
      // if (socket) {
      if (socketConnection.current) {
        dispatch(disconnectSocket());
        socketConnection.current = false;
      }
      // }
    }
  };

  useEffect(() => {
    var appStateListener = AppState.addEventListener("change", handleChange);
    return () => {
      appStateListener?.remove();
    };
  }, []);
  useEffect(() => {
    if (isFocused) dispatch(messageSelectionRemoved());
  }, [isFocused]);

  const keyExtractor = (id) => id;
  const listItem = ({ item }) => {
    return (
      <MemoRoomListItemMain
        navigation={navigation}
        roomId={item}
        currentUserId={currentUserId}
      />
    );
  };

  return (
    <Screen>
      {/* {!socket && ( */}
      {/* <ShowDocumentModal /> */}
      {!roomsFetched && (
        <View style={styles.loadingChats}>
          <ActivityIndicator />
          <AppText style={styles.loadingChatsText}>Loading chats</AppText>
        </View>
      )}
      {/* ehkä ei tarpeen olla kaikki varmistukset, ei päivitä alussa roomListItemiä niin montaa kertaa, mutta ehkä ei haittaa... */}
      {/* {socket && allActiveRoomsIds && ( */}
      {allActiveRoomsIds && (
        <FlatList
          style={{ paddingTop: 10 }}
          // data={sortObjectsByfield(userRooms, "roomName")}
          ItemSeparatorComponent={ListItemSeparator}
          data={allActiveRoomsIds}
          keyExtractor={keyExtractor}
          renderItem={listItem}
        />
      )}

      {/* <View>
        <TouchableOpacity onPress={() => logout()}>
          <Text>kirjaudu ulos</Text>
        </TouchableOpacity>
      </View> */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingChats: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loadingChatsText: { marginLeft: 10 },
});
export default RoomsListScreen;
