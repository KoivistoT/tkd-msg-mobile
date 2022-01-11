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

function RoomDetailsScreen(item) {
  const { params: roomData } = item.route;

  return (
    <Screen>
      <View style={{ flexDirection: "row" }}>
        <AppText>{roomData.roomName} </AppText>
      </View>

      <AppText>{roomData.created_at}</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomDetailsScreen;
