import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList, AppState, Keyboard } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import { MemoMessageItemMain } from "./messageItems/MessageItemMain";
import { useNavigation } from "@react-navigation/native";
import {
  selectIsLastMessageSentByCurrentUser,
  selectLastSeenMessageIdByRoomId,
  selectRoomMessageIdsByRoomId,
  selectRoomMessagesById,
  selectRoomMessagesIdsById,
} from "../../store/msgStore";

import {
  selectMessageSumByRoomId,
  selectRoomMessageSumByRoomId,
  selectTypersByRoomId,
} from "../../store/rooms";
import AppSearchTextInput from "./AppSearchTextInput";
import {
  pushNotificationPressedDeactivated,
  isPushNotificationPressed,
  errorMessageAdded,
} from "../../store/general";
import colors from "../../config/colors";
import ScrollDownButton from "./ScrollDownButton";
import UnreadMessagesButton from "./UnreadMessagesButton";
import {
  saveLastSeenMessageSum,
  selectLastSeenMessagSumByRoomId,
  selectCurrentUserId,
} from "../../store/currentUser";
import LoadingMessagesIndicator from "./LoadingMessagesIndicator";
import NewMessagesIndicator from "./NewMessagesIndicator";
import IsTypingElement from "./IsTypingElement";
import ShowSearchBarButton from "./ShowSearchBarButton";
import messageFuncs from "../../utility/messageFuncs";
const MAX_TO_RENDER_PER_BATCH = 20;

function MessageList({ item }) {
  const { _id: roomId, messageSum } = item.route.params;

  const dispatch = useDispatch();
  const nav = useNavigation();
  const store = useStore();
  const msgListRef = useRef();
  const newMessagesOnStart = useRef(null);
  const isNewMessagesChecked = useRef(false);

  const [currentSearchWord, setCurrentSearchWord] = useState(null);
  const [allMessagesFetched, setAllMessagesFetched] = useState(false);
  const [searchResultMessageIds, setSearchResultMessageIds] = useState(null);
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
  const [showUnreadMessageButton, setShowUnreadMessageButton] = useState(true);
  const [latestSeenMessageId, setLatestSeenMessageId] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const currentUserId = selectCurrentUserId(store);
  const typer = useSelector(selectTypersByRoomId(roomId, currentUserId));
  const roomMessageIds = useSelector(selectRoomMessageIdsByRoomId(roomId));
  const currentRoomMessageSum = useSelector(
    selectRoomMessageSumByRoomId(roomId)
  );
  const getLastSeenNow = () => selectLastSeenMessagSumByRoomId(store, roomId);

  const getNewMessagesSum = () => getRoomMessageSumNow() - getLastSeenNow();
  const getLastSeenMessageId = () => {
    const messageIndex = newMessagesOnStart.current - 1;

    return selectLastSeenMessageIdByRoomId(store, roomId, messageIndex);
  };
  const getRoomMessageSumNow = () => selectMessageSumByRoomId(store, roomId);

  useEffect(() => {
    newMessageScroll();
  }, [roomMessageIds]);

  useEffect(() => {
    checkNewMessages();
  }, [currentRoomMessageSum]);

  useEffect(() => {
    var appStateListener = AppState.addEventListener("change", handleChange);

    nav.setOptions({
      headerRight: () => (
        <ShowSearchBarButton
          onPress={() => setShowSearchBar((prevState) => !prevState)}
        />
      ),
    });

    return () => {
      appStateListener?.remove();
    };
  }, []);

  const keyExtractor = (listItem) => listItem;

  const messageItem = ({ item, index }) => {
    return (
      <View>
        {!allMessagesFetched && index === roomMessageIds.length - 1 && (
          <LoadingMessagesIndicator />
        )}
        {latestSeenMessageId === item && <NewMessagesIndicator />}
        <MemoMessageItemMain
          messageId={item}
          index={index}
          searchWord={currentSearchWord}
          roomId={roomId}
          currentUserId={currentUserId}
          onScrollToIndex={onScrollToIndex}
        />

        {typer && index === 0 && typer !== currentUserId && (
          <IsTypingElement typer={typer} roomId={roomId} />
        )}
      </View>
    );
  };

  const newMessageScroll = () => {
    if (currentRoomMessageSum === roomMessageIds?.length) {
      setAllMessagesFetched(true);

      return;
    }

    if (!roomMessageIds) {
      return;
    }

    if (
      selectIsLastMessageSentByCurrentUser(
        store,
        currentUserId,
        roomMessageIds[0],
        roomId
      )
    ) {
      onScrollToBottom(true);
    }
  };

  const saveMessageSum = () => {
    const unreadMessagesSum = messageFuncs.getLastSeenMessage(
      store.getState(),
      roomId,
      getRoomMessageSumNow()
    );

    if (unreadMessagesSum !== 0) {
      dispatch(
        saveLastSeenMessageSum(currentUserId, roomId, getRoomMessageSumNow())
      );
    }
  };

  const handleChange = (newState) => {
    if (newState === "active") {
      isNewMessagesChecked.current = true;
    } else if (newState === "background" || newState === "inactive") {
      newMessagesOnStart.current = null;
      isNewMessagesChecked.current = false;
    }
  };

  const checkNewMessages = () => {
    if (isNewMessagesChecked.current && !isPushNotificationPressed(store)) {
      setShowUnreadMessageButton(false);
    }

    if (!isNewMessagesChecked.current || isPushNotificationPressed(store)) {
      newMessagesOnStart.current += getNewMessagesSum();
      setShowUnreadMessageButton(true);

      if (isNewMessagesChecked.current) {
        dispatch(pushNotificationPressedDeactivated());
        setLatestSeenMessageId(getLastSeenMessageId());
      }
    }

    if (!isNewMessagesChecked.current) {
      setLatestSeenMessageId(getLastSeenMessageId());
      isNewMessagesChecked.current = true;
    }

    saveMessageSum();
  };

  const onScrollToBottom = (animate) => {
    try {
      msgListRef.current.scrollToIndex({
        animated: animate,
        index: 0,
      });
    } catch (error) {
      dispatch(errorMessageAdded("Something faild"));
    }
  };

  const onScrollToIndexFailed = (error) => {
    setShowLoader(true);
    msgListRef.current.scrollToOffset({
      offset: error.averageItemLength * error.index,
      animated: false,
    });

    if (
      error.highestMeasuredFrameIndex + MAX_TO_RENDER_PER_BATCH >=
      error.index
    ) {
      setShowLoader(false);
    }

    setTimeout(() => {
      if (msgListRef.current !== null) {
        msgListRef.current.scrollToIndex({
          index: error.index,
          animated: false,
        });
      }
    }, 1);
  };

  const onScrollToIndex = (replyMessageIndex, position, animation = true) => {
    try {
      msgListRef.current.scrollToIndex({
        animated: animation,
        index: replyMessageIndex,
        viewPosition: position,
      });
    } catch (error) {
      dispatch(errorMessageAdded("Something faild"));
    }
  };

  const onSearch = (searchWord) => {
    const filteredMessageIds = [];

    if (searchWord) {
      setCurrentSearchWord(searchWord);

      const roomAllMessages = { ...selectRoomMessagesById(store, roomId) };
      const roomAllMessageIds = [...selectRoomMessagesIdsById(store, roomId)];

      roomAllMessageIds.forEach((messageId) => {
        if (
          roomAllMessages[messageId].messageBody
            .toLowerCase()
            .includes(searchWord.toLowerCase()) &&
          !roomAllMessages[messageId].deleted
        ) {
          filteredMessageIds.push(messageId);
        }
      });
      setSearchResultMessageIds(filteredMessageIds);
    } else {
      setSearchResultMessageIds(null);
      setCurrentSearchWord(null);
    }
  };

  const getPosition = (e) => {
    if (e.nativeEvent.contentOffset.y >= 250) {
      setScrollButtonVisible(true);
    } else {
      setScrollButtonVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {showSearchBar && (
        <AppSearchTextInput
          onSearch={(a) => onSearch(a)}
          setShowSearchBar={setShowSearchBar}
          currentSearchWord={currentSearchWord}
          setShowUnreadMessageButton={setShowUnreadMessageButton}
        />
      )}
      {showUnreadMessageButton && newMessagesOnStart.current > 0 && (
        <UnreadMessagesButton
          unreadMessagesOnStart={newMessagesOnStart.current}
          onPress={onScrollToIndex}
          setShowUnreadMessageButton={setShowUnreadMessageButton}
        ></UnreadMessagesButton>
      )}

      {roomMessageIds && (
        <View style={styles.listContainer}>
          <View style={styles.touchMargin}></View>
          {showLoader && <View style={styles.cover} />}
          <FlatList
            style={styles.list}
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
            maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
            initialNumToRender={12}
            windowSize={4}
            inverted={true}
          />
        </View>
      )}

      {scrollButtonVisible && !showLoader && (
        <ScrollDownButton onPress={() => onScrollToBottom(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    width: "100%",
    position: "absolute",
    backgroundColor: colors.background1,
    height: "100%",
    zIndex: 2,
  },
  list: {
    backgroundColor: colors.background1,
  },
  listContainer: { flexDirection: "row", flex: 1 },
  touchMargin: {
    left: 0,
    width: 10,
    position: "absolute",
    height: "100%",
    zIndex: 2,
    opacity: 10,
  },
});
export default MessageList;
