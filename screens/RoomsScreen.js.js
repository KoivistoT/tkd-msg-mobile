import React, { useEffect, useRef } from "react";
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
// import RoomListItem from "../app/components/RoomListItem";
import RoomListItem from "../app/components/RoomListItem";
import sortObjectsByfield from "../utility/sortObjectsByfield";
import { selectAllActiveRoomsIds, selectUserRooms } from "../store/rooms";
// import NewDirectRoomModal from "../app/components/modals/NewDirectRoomModal";
import { MemoNewDirectRoomModal } from "../app/components/modals/NewDirectRoomModal";
// import CreateChannelModal from "../app/components/modals/CreateChannelModal";
import { MemoCreateChannelModal } from "../app/components/modals/CreateChannelModal";
import {
  selectAllUsersMinimal,
  selectUsersOnline,
  usersOnlineResived,
} from "../store/users";
import showOnlineIndicator from "../utility/showOnlineIndicator";

function RoomsScreen({ navigation }) {
  const dispatch = useDispatch();
  const store = useStore();
  // const userRooms = useSelector(selectUserRooms);
  const socket = useSelector(selectSocket);
  // const allUsers = useSelector(selectAllUsersMinimal);
  const currentUserId = store.getState().auth.currentUser._id;
  const allActiveRoomsIds = useSelector(selectAllActiveRoomsIds);
  // const allUsers1 = useSelector(selectAllUsers1);
  // const { allUsers, userRooms } = useSelector(selectUserRoomsAndAllUsers);
  // if (allUsers === null || Object.keys(allUsers).length === 0)
  // console.log("on null");
  // console.log("päivittää tällä", currentUserId);
  // const usersOnline = useSelector(selectUsersOnline);
  // console.log(allActiveRoomsIds);
  const logout = () => {
    userOffline();
    dispatch(disconnectSocket());
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
    // if (item.status === "archived" && item.roomCreator !== userId) return;
    return (
      <RoomListItem
        // showOnlineIndicator={showOnlineIndicator(
        //   item,
        //   usersOnline,
        //   currentUserId
        // )}
        navigation={navigation}
        // item={item}
        // allUsers={allUsers}
        roomId={item}
        currentUserId={currentUserId}
      />
    );
  };

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
