import React from "react";
import { View, StyleSheet } from "react-native";
import SeenButton from "./SeenButton";
import DeleteButton from "./DeleteButton";

function MessageOptionsButtonGroup({ onDelete, onSeen, isDeleted }) {
  return (
    <View style={styles.container}>
      {!isDeleted && <DeleteButton onPress={() => onDelete()} />}
      <SeenButton onPress={() => onSeen()}></SeenButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
export default MessageOptionsButtonGroup;
