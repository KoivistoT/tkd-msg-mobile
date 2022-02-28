import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Screen from "../app/components/Screen";
import { userLoggedOut } from "../store/currentUser";
import { disconnectSocket } from "../store/socket";
import RoomsListItem from "../app/components/RoomsListItem";
import sortObjectsByfield from "../utility/sortObjectsByfield";

function RoomsScreen({ navigation }) {
  const dispatch = useDispatch();
  const allRooms = useSelector((state) => state.entities.rooms.rooms);

  const logout = () => {
    dispatch(disconnectSocket());
    dispatch(userLoggedOut());
  };
  const keyExtractor = (item) => item._id;
  const listItem = ({ item }) => (
    <RoomsListItem navigation={navigation} item={item} />
  );

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
        <TouchableOpacity onPress={() => logout()}>
          <Text>kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomsScreen;
