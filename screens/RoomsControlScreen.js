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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListItemSeparator from "../app/components/ListItemSeparator";
import { useDispatch, useSelector } from "react-redux";
import Screen from "../app/components/Screen";
import { isLoggedIn, logout, selectToken, userLoggedOut } from "../store/auth";
import { getAllRooms } from "../store/rooms";
import AppText from "../app/components/AppText";
import colors from "../config/colors";
import routes from "../app/navigation/routes";
import CreateRoomModal from "../app/components/modals/CreateRoomModal";

function RoomsControlScreen({ navigation }) {
  const dispatch = useDispatch();

  const allRooms = useSelector((state) => state.entities.rooms.rooms);

  useEffect(() => {
    dispatch(getAllRooms());
  }, []);

  const listKeyExtractor = (data) => data._id;

  const listItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => navigation.navigate(routes.ROOM_DETAILS_SCREEN, item)}
    >
      <View>
        <View>
          <AppText style={styles.name}>{item.roomName}</AppText>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={25}
          color={colors.dark}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <CreateRoomModal />
      <FlatList
        ItemSeparatorComponent={() => <ListItemSeparator />}
        data={allRooms}
        bounces={false}
        keyExtractor={listKeyExtractor}
        renderItem={listItem}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomsControlScreen;
