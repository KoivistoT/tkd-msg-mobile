import React, { useEffect, useRef, useLayoutEffect } from "react";
import { View, StyleSheet, FlatList, Button, Text } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import MessageItemMain, {
  MemoMessageItemMain,
} from "./messageItems/MessageItemMain";
import {
  selectRoomMessageIdsByRoomId,
  selectRoomMessagesByRoomId,
} from "../../store/msgStore";
import sortObjectsByfield from "../../utility/sortObjectsByfield";
import { navigationRef } from "../navigation/rootNavigation";
import { selectAllUsersMinimal } from "../../store/users";

function MessageList({ item }) {
  const store = useStore();
  const msgListRef = useRef();
  const roomId = item.route.params._id;

  // const roomMessages = useSelector(selectRoomMessagesByRoomId(roomId));
  const currentUserId = store.getState().auth.currentUser._id;
  const roomMessageIds = useSelector(selectRoomMessageIdsByRoomId(roomId));
  //*********** */
  //*********** */
  // const allUsers = store.getState().entities.users.allUsers;
  // const allUsers = useSelector(selectAllUsersMinimal); // tämä ei tarvinne olla selector, voi tehdä raskaaksi
  //*********** */
  //*********** */

  const messageItem = ({ item }) => (
    <MemoMessageItemMain
      messageId={item}
      roomId={roomId}
      currentUserId={currentUserId}
    />
  );

  useEffect(() => {
    msgListRef.current.scrollToIndex({ animated: false, index: 0 });
  }, []);

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
          height: 400,
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
            maxToRenderPerBatch={30} //default 10
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
