import React, { useEffect } from "react";
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
import { userLoggedOut } from "../store/currentUser";
import { disconnectSocket, selectSocket } from "../store/socket";
import { MemoRoomListItemMain } from "../app/components/RoomListItem";
import {
  roomStateCleared,
  selectAllActiveRoomsIds,
  selectAllActiveRoomsIdsOld,
} from "../store/rooms";
import { MemoNewDirectRoomModal } from "../app/components/modals/NewDirectRoomModal";
import { MemoCreateChannelModal } from "../app/components/modals/CreateChannelModal";
import { usersOnlineResived } from "../store/users";

function RoomsScreen({ navigation }) {
  const dispatch = useDispatch();
  const store = useStore();
  const socket = useSelector(selectSocket);
  const currentUserId = store.getState().auth.currentUser._id;
  const allActiveRoomsIds = useSelector(selectAllActiveRoomsIdsOld);
  // const allActiveRoomsIds = useSelector(selectAllActiveRoomsIds);

  const logout = () => {
    userOffline();

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

  const handleChange = (newState) => {
    if (newState === "active") {
      userOnline();
    } else if (newState === "background") {
      userOffline();
    }
  };

  useEffect(() => {
    if (socket) {
      handleChange(AppState.currentState);
      var appStateListener = AppState.addEventListener("change", handleChange);
    }
    return () => {
      appStateListener?.remove();
    };
  }, [socket]);

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

  // const sortRoomsByLastMessage = () => {
  //   allActiveRoomsIds.sort(function (a, b) {
  //     console.log(a, b);
  //     var nameA = a[field];
  //     var nameB = b[field];

  //     if (nameA > nameB) {
  //       return 1;
  //     }
  //     if (nameA < nameB) {
  //       return -1;
  //     }
  //     return 0;
  //   });
  // };
  // sortRoomsByLastMessage();
  return (
    <Screen>
      {!socket && (
        <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />
      )}
      {/* ehkä ei tarpeen olla kaikki varmistukset, ei päivitä alussa roomListItemiä niin montaa kertaa, mutta ehkä ei haittaa... */}
      {socket && allActiveRoomsIds && (
        <FlatList
          // data={sortObjectsByfield(userRooms, "roomName")}

          data={allActiveRoomsIds}
          keyExtractor={keyExtractor}
          renderItem={listItem}
        />
      )}

      <View>
        <MemoCreateChannelModal />
        <MemoNewDirectRoomModal />
        <TouchableOpacity onPress={() => logout()}>
          <Text>kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomsScreen;
