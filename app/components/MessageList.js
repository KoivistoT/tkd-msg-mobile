import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  Text,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import MessageItemMain, {
  MemoMessageItemMain,
} from "./messageItems/MessageItemMain";

import {
  messageSelected,
  selectRoomMessageIdsByRoomId,
  selectRoomMessagesByRoomId,
} from "../../store/msgStore";
import sortObjectsByfield from "../../utility/sortObjectsByfield";
import { navigationRef } from "../navigation/rootNavigation";
import { selectAllUsersMinimal } from "../../store/users";
import AppTextInput from "./AppTextInput";
import { TouchableOpacity } from "react-native-gesture-handler";
import AppButton from "./AppButton";
import AppSearchTextInput from "./AppSearchTextInput";
import { messageFormFocusCleared } from "../../store/general";
import colors from "../../config/colors";
import ScrollDownButton from "./ScrollDownButton";

function MessageList({ item, showSearchBar }) {
  const store = useStore();
  const dispatch = useDispatch();
  const msgListRef = useRef();
  const roomId = item.route.params._id;
  // console.log("tämä päivittyy myös");
  // const roomMessages = useSelector(selectRoomMessagesByRoomId(roomId));
  const currentUserId = store.getState().auth.currentUser._id;
  const roomMessageIds = useSelector(selectRoomMessageIdsByRoomId(roomId));
  const [currentSearchWord, setcurrentSearchWord] = useState(null);
  //*********** */
  //*********** */
  // const allUsers = store.getState().entities.users.allUsers;
  // const allUsers = useSelector(selectAllUsersMinimal); // tämä ei tarvinne olla selector, voi tehdä raskaaksi
  //*********** */
  //*********** */

  const messageItem = ({ item }) => (
    <MemoMessageItemMain
      messageId={item}
      searchWord={currentSearchWord}
      roomId={roomId}
      currentUserId={currentUserId}
      onScrollToIndex={onScrollToIndex}
    />
  );

  useEffect(() => {
    if (
      store.getState().entities.msgStore.allMessages[roomId]?.messages[
        roomMessageIds[0]
      ]?.postedByUser === currentUserId
    ) {
      try {
        onScrollToBottom(true);
      } catch (error) {}
    }
  }, [roomMessageIds]);

  const onScrollToIndex = (replyMessageIndex) => {
    msgListRef.current.scrollToIndex({
      animated: true, // tämä voisi olla false
      index: replyMessageIndex,
      viewPosition: 0.5,
    });
  };

  const onScrollToBottom = (animate) => {
    msgListRef.current.scrollToIndex({
      animated: animate,
      index: 0,
    });
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

  const [searchResultMessageIds, setSearchResultMessageIds] = useState(null);
  const onSearch = (searchWord) => {
    const filteredMessageIds = [];

    if (searchWord) {
      setcurrentSearchWord(searchWord);
      const roomAllMessages = {
        ...store.getState().entities.msgStore.allMessages[roomId].messages,
      };
      const roomAllMessageIds = [
        ...store.getState().entities.msgStore.allMessageIds[roomId],
      ];
      roomAllMessageIds.forEach((messageId) => {
        if (
          roomAllMessages[messageId].messageBody
            .toLowerCase()
            .includes(searchWord.toLowerCase())
        )
          filteredMessageIds.push(messageId);
      });
      setSearchResultMessageIds(filteredMessageIds);
    } else {
      setSearchResultMessageIds(null);
      setcurrentSearchWord(null);
    }
  };

  const getPosition = (e) => {
    e.nativeEvent.contentOffset.y >= 250
      ? setScrollButtonVisible(true)
      : setScrollButtonVisible(false);
  };
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
  return (
    <View style={styles.container}>
      {showSearchBar && <AppSearchTextInput onSearch={onSearch} />}

      {roomMessageIds && (
        <FlatList
          ref={msgListRef}
          data={
            searchResultMessageIds ? searchResultMessageIds : roomMessageIds
          }
          onScroll={(e) => getPosition(e)}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          onScrollToIndexFailed={onScrollToIndexFailed}
          keyExtractor={keyExtractor}
          renderItem={messageItem}
          onEndReachedThreshold={0.7}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          windowSize={5} // voisi olla isompi, mut ei ehkä tarvi
          inverted={true}
        />
      )}
      {scrollButtonVisible && (
        <ScrollDownButton onPress={() => onScrollToBottom(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default MessageList;
