import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../config/colors";

import AppText from "./AppText";
import ShowImageModal from "../components/imageComponents/ShowImageModal";

function MessageItem({ item, userId }) {
  return (
    <TouchableOpacity
      style={item.postedByUser === userId ? styles.me : styles.otherUser}
    >
      <ShowImageModal />
      <AppText key={item._id}>{item.messageBody}</AppText>
      {/* {item.imageURLs &&
        item.imageURLs.length !== 0 &&
        item.imageURLs.map((url) => (
          <ShowImageModal imageURLs={item.imageURLs} image={url} />
        ))} */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});
export default MessageItem;
