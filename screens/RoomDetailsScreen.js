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
import { useDispatch, useSelector } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { getAllUsers } from "../store/users";
import colors from "../config/colors";
import AppSwitch from "../app/components/forms/AppSwitch";
import { getMembersById } from "../store/rooms";
import AppButton from "../app/components/AppButton";

function RoomDetailsScreen(item) {
  const { params: roomData } = item.route;
  const { users } = useSelector((state) => state.entities.users);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getMembersById(roomData._id));
  }, []);

  const addUserToRoom = (permission) => {
    console.log(permission, "tälle action");
  };
  console.log(
    "ensin hakee membersit ja sit myös kaikki userit, kun userin lisää huoneeseen, sen id menee memberseihin"
  );
  // console.log(
  //   "tarvitsee actionin ja sen, että katsoo kuuluuko huoneeseen, eli pitääkin hakea huoneen membersit myös ja sitten ne yhdistää. sen voi tehdä BE:ssä "
  // );
  console.log("listitemit voisi olla jossain reusable");
  const usersListItem = ({ item }) => (
    <View key={item._id}>
      <AppText style={{ paddingLeft: 10, marginTop: 4 }}>
        {item.displayName}
      </AppText>
      <AppButton title="Add to room" />
    </View>
  );
  const membersListItem = ({ item }) => (
    <View key={item._id}>
      <AppText style={{ paddingLeft: 10, marginTop: 4 }}>
        {item.displayName}
      </AppText>
      <AppButton title="Add to room" />
    </View>
  );
  return (
    <Screen>
      <View style={{ flexDirection: "row" }}>
        <AppText>{roomData.roomName} </AppText>
      </View>
      <AppText>Room members</AppText>
      {/* <FlatList
        ItemSeparatorComponent={() => <ListItemSeparator />}
        data={users}
        bounces={false}
        keyExtractor={(data) => data._id}
        renderItem={usersListItem}
      /> */}
      <AppText>All users</AppText>
      <FlatList
        ItemSeparatorComponent={() => <ListItemSeparator />}
        data={users}
        bounces={false}
        keyExtractor={(data) => data._id}
        renderItem={usersListItem}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomDetailsScreen;
