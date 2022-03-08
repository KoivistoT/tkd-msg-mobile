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
// import RoomsListItem from "../app/components/RoomsListItem";
import RoomsListItem from "../app/components/RoomsListItem";
import sortObjectsByfield from "../utility/sortObjectsByfield";
import { getUserRooms } from "../store/rooms";
// import NewDirectRoomModal from "../app/components/modals/NewDirectRoomModal";
import { MemoNewDirectRoomModal } from "../app/components/modals/NewDirectRoomModal";
// import CreateChannelModal from "../app/components/modals/CreateChannelModal";
import { MemoCreateChannelModal } from "../app/components/modals/CreateChannelModal";
import {
  selectAllUsers,
  selectAllUsers1,
  selectAllUsers2,
  selectAllUsersMinimal,
  selectUserRoomsAndAllUsers,
  selectUsersOnline,
  usersOnlineResived,
} from "../store/users";

function RoomsScreen({ navigation }) {
  const dispatch = useDispatch();
  const userRooms = useSelector(getUserRooms);
  const store = useStore();

  const currentUserId = store.getState().auth.currentUser._id;
  // const allUsers1 = useSelector(selectAllUsers1);
  const allUsers = useSelector(selectAllUsersMinimal);
  // const { allUsers, userRooms } = useSelector(selectUserRoomsAndAllUsers);
  // if (allUsers === null || Object.keys(allUsers).length === 0)
  // console.log("on null");
  // console.log("päivittää tällä", currentUserId);
  const usersOnline = useSelector(selectUsersOnline);

  const showOnlineIndicator = (item) => {
    if (Object.keys(usersOnline).length === 0) return;
    return item.type === "private" &&
      usersOnline &&
      usersOnline.includes(
        getPrivateRoomOtherUserId(item.members, currentUserId)
      )
      ? true
      : false;
  };

  const logout = () => {
    userOffline();
    dispatch(disconnectSocket());
    dispatch(userLoggedOut());
  };

  const socket = useSelector(selectSocket);

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

  const keyExtractor = (item) => item._id;
  const listItem = ({ item }) => {
    if (item.status === "archived" && item.roomCreator !== userId) return;
    return (
      <RoomsListItem
        showOnlineIndicator={showOnlineIndicator(item)}
        navigation={navigation}
        item={item}
        allUsers={allUsers}
        currentUserId={currentUserId}
      />
    );
  };

  return (
    <Screen>
      {!userRooms && (
        <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />
      )}
      {Object.keys(userRooms).length !== 0 && usersOnline.length > 0 && (
        <FlatList
          data={sortObjectsByfield(userRooms, "roomName")}
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
