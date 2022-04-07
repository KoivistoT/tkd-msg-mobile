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
import UnreadMessagesButton from "./UnreadMessagesButton";
import { selectLastSeenMessagesById } from "../../store/currentUser";

function MessageList({
  item,
  showSearchBar,
  setShowSearchBar,
  dispatchScrollToIndex,
}) {
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
  const messageItem = ({ item }) => {
    return (
      <View>
        {lastSeenMessageId === item && (
          <Text style={{ alignSelf: "center", color: colors.danger }}>
            NEW MESSAGES
          </Text>
        )}
        <MemoMessageItemMain
          messageId={item}
          searchWord={currentSearchWord}
          roomId={roomId}
          currentUserId={currentUserId}
          onScrollToIndex={onScrollToIndex}
        />
      </View>
    );
  };

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

  // const lastSeenMessagesNow = useSelector(selectLastSeenMessagesById(roomId));
  const [lastSeenMessageId, setLasetSeenMessageId] = useState(null);
  let unreadMessagesOnStart = useRef(null);
  // console.log("Messagelist päivittyy");

  useLayoutEffect(() => {
    try {
      const { messageSum, _id: roomId } = item.route.params;
      const lastSeenMessagesNow =
        store.getState().auth.currentUser.last_seen_messages[
          store
            .getState()
            .auth.currentUser.last_seen_messages.findIndex(
              (object) => object.roomId === roomId
            )
        ].lastSeenMessageSum;
      const unreadMessages = messageSum - lastSeenMessagesNow;
      unreadMessagesOnStart.current = unreadMessages;

      setLasetSeenMessageId(roomMessageIds[unreadMessages - 1]);
    } catch (error) {
      console.log(error, "code 662112");
    }
  }, []);

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

  const onScrollToIndex = (replyMessageIndex) => {
    try {
      msgListRef.current.scrollToIndex({
        animated: true, // tämä voisi olla false
        index: replyMessageIndex,
        viewPosition: 0.5,
      });
    } catch (error) {
      console.log(error, "code 87271");
    }
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

  // console.log("messagelista päivittyy----");
  const getPosition = (e) => {
    e.nativeEvent.contentOffset.y >= 250
      ? setScrollButtonVisible(true)
      : setScrollButtonVisible(false);
  };
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
  const [showUnreadMessageButton, setShowUnreadMessageButton] = useState(true);
  return (
    <View style={styles.container}>
      {showSearchBar && (
        <AppSearchTextInput
          setShowSearchBar={setShowSearchBar}
          onSearch={onSearch}
        />
      )}
      {showUnreadMessageButton && unreadMessagesOnStart.current > 0 && (
        <UnreadMessagesButton
          unreadMessagesOnStart={unreadMessagesOnStart.current}
          onPress={onScrollToIndex}
          setShowUnreadMessageButton={setShowUnreadMessageButton}
        ></UnreadMessagesButton>
      )}
      {roomMessageIds && (
        <FlatList
          style={{ backgroundColor: colors.background1, padding: 5 }}
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
          initialNumToRender={12}
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
    // paddingHorizontal: 10,
    // backgroundColor: colors.background1,
  },
});
export default MessageList;
