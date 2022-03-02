import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListItemSeparator from "../app/components/ListItemSeparator";
import { useDispatch, useSelector } from "react-redux";
import Screen from "../app/components/Screen";

import { getAllGroupRooms, getAllRooms } from "../store/roomsControl";
import AppText from "../app/components/AppText";
import colors from "../config/colors";
import routes from "../app/navigation/routes";
import CreateChannelModal from "../app/components/modals/CreateChannelModal";

function RoomsControlScreen({ navigation }) {
  const dispatch = useDispatch();

  const allRooms = useSelector(getAllGroupRooms());

  useEffect(() => {
    dispatch(getAllRooms());
  }, []);

  const listKeyExtractor = (data) => data._id;

  const listItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.5}
      style={{
        backgroundColor: item.status === "archived" ? "yellow" : "white",
      }}
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
      <CreateChannelModal />
      {allRooms && (
        <FlatList
          ItemSeparatorComponent={() => <ListItemSeparator />}
          data={Object.values(allRooms)}
          bounces={false}
          keyExtractor={listKeyExtractor}
          renderItem={listItem}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomsControlScreen;
