import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";

import AppText from "../AppText";
import ShowImageModal from "../imageComponents/ShowImageModal";
function MessageItemImage({ item }) {
  return (
    <View
      style={{
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        flex: 1,
      }}
    >
      {item.imageURLs.map((url) => (
        <ShowImageModal key={url} item={item} image={url} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({});
export default MessageItemImage;
