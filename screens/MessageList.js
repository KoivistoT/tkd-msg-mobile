import React, { useEffect, useRef } from "react";
import { View, StyleSheet, FlatList, Button, Text } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import MessageItem from "../app/components/MessageItem";
import { getRoomImages, getRoomMessagesByRoomId } from "../store/msgStore";

function MessageList({ item }) {
  const dispatch = useDispatch();
  const store = useStore();
  const roomId = item.route.params._id;
  const roomMessages = useSelector(getRoomMessagesByRoomId(roomId));
  const userId = store.getState().auth.currentUser._id;
  const isImagesFetched = useRef(false);
  const messageItem = ({ item }) => <MessageItem item={item} userId={userId} />;

  useEffect(() => {
    getAllImages();
  }, [roomMessages]);

  const getAllImages = () => {
    if (isImagesFetched.current === false) {
      dispatch(getRoomImages(roomId));
      isImagesFetched.current = true;
    }
    if (
      Object.values(roomMessages)[Object.keys(roomMessages).length - 1].type ===
        "image" &&
      isImagesFetched.current !== false
    ) {
      dispatch(getRoomImages(roomId));
    }
  };

  return (
    <>
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
