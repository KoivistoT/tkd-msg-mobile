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
import { useDispatch, useSelector } from "react-redux";
import Screen from "../app/components/Screen";
import { isLoggedIn, logout, selectToken, userLoggedOut } from "../store/auth";
import { getMessagesbyId } from "../store/rooms";

function RoomsControlScreen({}) {
  useEffect(() => {
    // return () => {
    //     cleanup
    // }
  }, []);
  return <Screen></Screen>;
}

const styles = StyleSheet.create({});
export default RoomsControlScreen;
