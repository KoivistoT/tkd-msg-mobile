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
  const dispatch = useDispatch();

  const { params: userData } = item.route;

  useEffect(() => {
    // return () => {
    //     cleanup
    // }
  }, []);
  return (
    <Screen>
      <AppText>{userData.name}</AppText>
      {userData.userRooms && (
        <FlatList
          ItemSeparatorComponent={() => <ListItemSeparator />}
          data={userData.userRooms}
          bounces={false}
          keyExtractor={(data) => data}
          renderItem={({ item }) => (
            <AppText style={styles.name}>{item}</AppText>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default UserDetailsScreen;
