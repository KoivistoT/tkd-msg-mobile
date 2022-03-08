import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";
import ShowImageModal from "../imageComponents/ShowImageModal";
import { selectMessageById } from "../../../store/msgStore";

function ReplyItem({ item }) {
  console.log(item);
  const { roomId, messageId } = item;

  const messageData2 = useSelector(selectMessageById(roomId, messageId));
  console.log(messageData2, "täällä reply data");

  return <AppText>juu on</AppText>;
}

const styles = StyleSheet.create({});
export default ReplyItem;
