import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";

import AppText from "../AppText";
import ShowImageModal from "../imageComponents/ShowImageModal";
function MessageItemImage({ item }) {
  return item.imageURLs.map((url) => (
    <ShowImageModal key={url} item={item} image={url} />
  ));
}

const styles = StyleSheet.create({});
export default MessageItemImage;
