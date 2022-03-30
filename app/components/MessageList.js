import React, { useEffect, useRef, useLayoutEffect } from "react";
import { View, StyleSheet, FlatList, Button, Text } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import MessageItemMain, {
  MemoMessageItemMain,
} from "./messageItems/MessageItemMain";
import {
  messageSelected,
  messagesFromStorageFetched,
  selectRoomMessageIdsByRoomId,
  selectRoomMessagesByRoomId,
} from "../../store/msgStore";
import sortObjectsByfield from "../../utility/sortObjectsByfield";
import { navigationRef } from "../navigation/rootNavigation";
import { selectAllUsersMinimal } from "../../store/users";

function MessageList({ item }) {
  const store = useStore();
  const dispatch = useDispatch();
  const msgListRef = useRef();
  const roomId = item.route.params._id;
  // console.log("tämä päivittyy myös");
  // const roomMessages = useSelector(selectRoomMessagesByRoomId(roomId));
  const currentUserId = store.getState().auth.currentUser._id;
  const roomMessageIds = useSelector(selectRoomMessageIdsByRoomId(roomId));
  //*********** */
  //*********** */
  // const allUsers = store.getState().entities.users.allUsers;
  // const allUsers = useSelector(selectAllUsersMinimal); // tämä ei tarvinne olla selector, voi tehdä raskaaksi
  //*********** */
  //*********** */
  // console.log("MessageLists päivittyy");
  const messageItem = ({ item }) => (
    <MemoMessageItemMain
      messageId={item}
      roomId={roomId}
      currentUserId={currentUserId}
      onScrollToIndex={onScrollToIndex}
    />
  );

  useEffect(() => {
    try {
      msgListRef.current.scrollToIndex({ animated: false, index: 0 });
    } catch (error) {}
  }, []);

  const onScrollToIndex = (replyMessageIndex) => {
    msgListRef.current.scrollToIndex({
      animated: true, // tämä voisi olla false
      index: replyMessageIndex,
      viewPosition: 1,
    });
  };

  onGetMoreMessages = () => {
    //tämä ei enää ole olellinen, jos kaikki on samassa paikassa, ja nyt tuo on ihan muut viestit
    // dispatch(messagesFromStorageFetched(roomId));
  };
  const keyExtractor = (item) => item;

  const onScrollToIndexFailed = (error) => {
    msgListRef.current.scrollToOffset({
      offset: error.averageItemLength * error.index,
      animated: false,
    });
    setTimeout(() => {
      if (msgListRef.current !== null) {
        msgListRef.current.scrollToIndex({
          index: error.index,
          animated: false,
        });
      }
    }, 10);
  };

  return (
    <>
      <View
        style={{
          borderWidth: 1,
          width: "100%",
          height: 300,
          color: "black",
        }}
      >
        {roomMessageIds && (
          <FlatList
            ref={msgListRef}
            // data={sortObjectsByfield(roomMessages, "createdAt")}
            data={roomMessageIds}
            onScrollToIndexFailed={onScrollToIndexFailed}
            keyExtractor={keyExtractor}
            renderItem={messageItem}
            onEndReachedThreshold={0.7}
            onEndReached={() => onGetMoreMessages()}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            windowSize={30}
            inverted={true}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
export default MessageList;
