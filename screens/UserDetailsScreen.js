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

function UserDetailsScreen(item) {
  const { params: userData } = item.route;

  const userItem = ({ item }) => <AppText style={styles.name}>{item}</AppText>;

  return (
    <Screen>
      <View style={{ flexDirection: "row" }}>
        <AppText>{userData.firstName} </AppText>
        <AppText>{userData.lastName}</AppText>
      </View>

      {userData.userRooms.length > 0 && (
        <FlatList
          ItemSeparatorComponent={() => <ListItemSeparator />}
          data={userData.userRooms}
          bounces={false}
          keyExtractor={(data) => data}
          renderItem={userItem}
        />
      )}
      {userData.userRooms.length === 0 && <AppText>User has no rooms</AppText>}
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default UserDetailsScreen;
