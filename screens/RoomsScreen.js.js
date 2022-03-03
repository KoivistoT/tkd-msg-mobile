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
import { getCurrentUserById, userLoggedOut } from "../store/currentUser";
import { disconnectSocket } from "../store/socket";
import RoomsListItem from "../app/components/RoomsListItem";
import sortObjectsByfield from "../utility/sortObjectsByfield";
import { getUserRooms } from "../store/rooms";
import NewDirectRoomModal from "../app/components/modals/NewDirectRoomModal";
import CreateChannelModal from "../app/components/modals/CreateChannelModal";
import { allUsers } from "../store/users";

function RoomsScreen({ navigation }) {
  const dispatch = useDispatch();
  const allRooms = useSelector(getUserRooms);
  const store = useStore();
  const currentUserId = store.getState().auth.currentUser._id;
  const allUsersList = useSelector(allUsers());

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
        allUsersList={allUsersList}
        currentUserId={currentUserId}
      />
    );
  };

  return (
    <Screen>
      {!allRooms && (
        <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />
      )}
      {allRooms && (
        <FlatList
          data={sortObjectsByfield(allRooms, "roomName")}
          keyExtractor={keyExtractor}
          renderItem={listItem}
        />
      )}

      <View>
        <CreateChannelModal />
        <NewDirectRoomModal />
        <TouchableOpacity onPress={() => logout()}>
          <Text>kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomsScreen;
