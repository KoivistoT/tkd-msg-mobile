import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import Screen from "../app/components/Screen";
import { userLoggedOut } from "../store/currentUser";
import { disconnectSocket } from "../store/socket";
// import RoomsListItem from "../app/components/RoomsListItem";
import RoomsListItem from "../app/components/RoomsListItem";
import sortObjectsByfield from "../utility/sortObjectsByfield";
import { getUserRooms } from "../store/rooms";
// import NewDirectRoomModal from "../app/components/modals/NewDirectRoomModal";
import { MemoNewDirectRoomModal } from "../app/components/modals/NewDirectRoomModal";
// import CreateChannelModal from "../app/components/modals/CreateChannelModal";
import { MemoCreateChannelModal } from "../app/components/modals/CreateChannelModal";
import { selectAllUsers, selectUserRoomsAndAllUsers } from "../store/users";

function RoomsScreen({ navigation }) {
  const dispatch = useDispatch();
  // const userRooms = useSelector(getUserRooms);
  const store = useStore();
  const currentUserId = store.getState().auth.currentUser._id;
  // const allUsers = useSelector(selectAllUsers());
  const { allUsers, userRooms } = useSelector(selectUserRoomsAndAllUsers());
  if (allUsers === null) console.log("on null");
  console.log("tämä");
  const logout = () => {
    dispatch(disconnectSocket());
    dispatch(userLoggedOut());
  };

  const keyExtractor = (item) => item._id;
  const listItem = ({ item }) => {
    if (item.status === "archived" && item.roomCreator !== userId) return;
    return (
      <RoomsListItem
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
      {userRooms && (
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
