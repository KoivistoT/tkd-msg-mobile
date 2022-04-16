import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  Text,
  AppState,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import MessageItemMain, {
  MemoMessageItemMain,
} from "./messageItems/MessageItemMain";
import { useNavigation } from "@react-navigation/native";
import {
  messageSelected,
  selectIsLastMessageSentByCurrentUser,
  selectLastSeenMessageIdByRoomId,
  selectRoomMessageIdsByRoomId,
  selectRoomMessagesById,
  selectRoomMessagesByRoomId,
  selectRoomMessagesIdsById,
} from "../../store/msgStore";
import userFuncs from "../../utility/userFuncs";
import sortObjectsByfield from "../../utility/sortObjectsByfield";
import { navigationRef } from "../navigation/rootNavigation";
import { selectAllUsersMinimal } from "../../store/users";
import AppTextInput from "./AppTextInput";
import { TouchableOpacity } from "react-native-gesture-handler";
import AppButton from "./AppButton";
import {
  selectMessageSumByRoomId,
  lastStorageAdded,
  selectLastStorage,
  selectRoomMessageSumByRoomId,
  selectTypersByRoomId,
  selectUnreadSum,
} from "../../store/rooms";
import AppSearchTextInput from "./AppSearchTextInput";
import {
  pushNotificationPressedDeactivated,
  pushNotificationPressed,
  messageFormFocusCleared,
  isPushNotificationPressed,
} from "../../store/general";
import colors from "../../config/colors";
import ScrollDownButton from "./ScrollDownButton";
import UnreadMessagesButton from "./UnreadMessagesButton";
import {
  saveLastSeenMessageSum,
  selectLastSeenMessagesById,
  getUnseenMessageSum,
  selectCurrentRoomNewMessagesSum,
  selectLastSeenMessagSumByRoomId,
  selectCurrenUserId,
} from "../../store/currentUser";
import LoadingMessagesIndicator from "./LoadingMessagesIndicator";
import AppText from "./AppText";
import NewMessagesIndicator from "./NewMessagesIndicator";
import IsTypingElement from "./IsTypingElement";
import ShowSearchBarButton from "./ShowSearchBarButton";
import { useIsFocused } from "@react-navigation/native";
import { selectSocket } from "../../store/socket";
import messageFuncs from "../../utility/messageFuncs";
const MAX_TO_RENDER_PER_BATCH = 20;

function MessageList({ item }) {
  const { _id: roomId, messageSum } = item.route.params;

  const dispatch = useDispatch();
  const nav = useNavigation();
  const store = useStore();
  const msgListRef = useRef();
  let newMessagesOnStart = useRef(null);
  let isNewMessagesChecked = useRef(false);

  const [currentSearchWord, setCurrentSearchWord] = useState(null);
  const [allMessagesFetched, setAllMessagesFetched] = useState(false);
  const [searchResultMessageIds, setSearchResultMessageIds] = useState(null);
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
  const [showUnreadMessageButton, setShowUnreadMessageButton] = useState(true);
  const [latestSeenMessageId, setLatestSeenMessageId] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const currentUserId = selectCurrenUserId(store);
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

  const keyExtractor = (item) => item;
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
        {/* tämä ei näytä jos ei ole viestejä,,, ei ehkä tarvikaan */}

        {typer && index === 0 && typer !== currentUserId && (
          <IsTypingElement typer={typer} roomId={roomId} />
        )}
      </View>
    );
  };

  const newMessageScroll = () => {
    if (messageSum === roomMessageIds?.length) {
      setAllMessagesFetched(true);
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
      newMessagesOnStart.current = null; // tämä lienee maku asia. Tulee esiin silloin, kun on huoneessa ja siellä on lukemattomia, kun menee pois ja tulee takaisin, miten näyttää
      isNewMessagesChecked.current = false;
    }
  };

  const checkNewMessages = async () => {
    //tämä maku asia
    //tämä maku asia
    //tämä maku asia
    if (isNewMessagesChecked.current && !isPushNotificationPressed(store)) {
      setShowUnreadMessageButton(false);
    }
    //tämä maku asia
    //tämä maku asia
    //tämä maku asia

    if (!isNewMessagesChecked.current || isPushNotificationPressed(store)) {
      newMessagesOnStart.current += getNewMessagesSum();
      setShowUnreadMessageButton(true); //tämä maku asiaa

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
      console.log(error, "code 2971662");
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
        animated: animation, // tämä voisi olla false
        index: replyMessageIndex,
        viewPosition: position,
      });
    } catch (error) {
      console.log(error, "code 87271");
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
            .includes(searchWord.toLowerCase())
        )
          filteredMessageIds.push(messageId);
      });
      setSearchResultMessageIds(filteredMessageIds);
    } else {
      setSearchResultMessageIds(null);
      setCurrentSearchWord(null);
    }
  };

  const getPosition = (e) => {
    e.nativeEvent.contentOffset.y >= 250
      ? setScrollButtonVisible(true)
      : setScrollButtonVisible(false);
  };

  return (
    <View style={styles.container}>
      {showSearchBar && (
        <AppSearchTextInput
          onSearch={(a) => onSearch(a)}
          setShowSearchBar={setShowSearchBar}
          currentSearchWord={currentSearchWord}
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
        <View style={{ flexDirection: "row", flex: 1 }}>
          <View style={[styles.touchMargin, { left: 0 }]}></View>
          {showLoader && (
            <View
              style={{
                width: "100%",
                position: "absolute",
                backgroundColor: "red",
                height: "100%",
                zIndex: 200,
                // backgroundColor: "red",

                zIndex: 2,
                opacity: 0.5,
              }}
            ></View>
          )}
          <FlatList
            style={{
              backgroundColor: colors.background1,

              // paddingHorizontal: 10,
            }}
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
            windowSize={4} // voisi olla isompi, mut ei ehkä tarvi
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

    // backgroundColor: colors.background1,
  },
  touchMargin: {
    width: 25,
    position: "absolute",

    height: "100%",
    zIndex: 200,
    // backgroundColor: "red",
    zIndex: 1,
    opacity: 10,
  },
});
export default MessageList;
