import React from "react";
import { View, StyleSheet, FlatList, Button, Text } from "react-native";
import { useSelector } from "react-redux";
import { getRoomMessagesByRoomId } from "../store/msgStore";

function MessageList({ item }) {
  const roomId = item.route.params._id;
  const roomMessages = useSelector(getRoomMessagesByRoomId(roomId));

  const messageItem = ({ item }) => (
    <Text
      style={{
        color: "black",
        backgroundColor: "white",
      }}
      key={item._id}
    >
      {item.messageBody}
    </Text>
  );

  return (
    <>
      <Button onPress={() => testi()} title={"test"}></Button>
      <View
        style={{
          borderWidth: 1,
          width: 300,
          height: 400,
          color: "black",
        }}
      >
        {roomMessages && (
          <FlatList
            data={Object.values(roomMessages).sort(function (a, b) {
              var nameA = a.createdAt;
              var nameB = b.createdAt;
              if (nameA > nameB) {
                return 1;
              }
              if (nameA < nameB) {
                return -1;
              }
              return 0;
            })}
            keyExtractor={(message) => message._id}
            renderItem={messageItem}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
export default MessageList;
