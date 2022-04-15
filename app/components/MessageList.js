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
  selectRoomMessageIdsByRoomId,
  selectRoomMessagesByRoomId,
} from "../../store/msgStore";
import userFuncs from "../../utility/userFuncs";
import sortObjectsByfield from "../../utility/sortObjectsByfield";
import { navigationRef } from "../navigation/rootNavigation";
import { selectAllUsersMinimal } from "../../store/users";
import AppTextInput from "./AppTextInput";
import { TouchableOpacity } from "react-native-gesture-handler";
import AppButton from "./AppButton";
import {
  lastStorageAdded,
  selectLastStorage,
  selectRoomMessageSumByRoomId,
  selectTypersByRoomId,
  selectUnreadSum,
} from "../../store/rooms";
import AppSearchTextInput from "./AppSearchTextInput";
import { messageFormFocusCleared } from "../../store/general";
import colors from "../../config/colors";
import ScrollDownButton from "./ScrollDownButton";
import UnreadMessagesButton from "./UnreadMessagesButton";
import {
  saveLastSeenMessageSum,
  selectLastSeenMessagesById,
  getUnseenMessageSum,
  selectCurrentRoomNewMessagesSum,
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

function MessageList({
  item,
  showSearchBar,
  setShowSearchBar,
  dispatchScrollToIndex,
}) {
  const nav = useNavigation();
  const store = useStore();
  const dispatch = useDispatch();
  const msgListRef = useRef();
  const { _id: roomId, messageSum } = item.route.params;
  // console.log("tämä päivittyy myös");
  // const roomMessages = useSelector(selectRoomMessagesByRoomId(roomId));
  const currentUserId = store.getState().auth.currentUser._id;
  const roomMessageIds = useSelector(selectRoomMessageIdsByRoomId(roomId));
  const [currentSearchWord, setcurrentSearchWord] = useState(null);
  const isFocused = useIsFocused();
  const typer = useSelector(selectTypersByRoomId(roomId, currentUserId));
  //*********** */
  //*********** */
  // const allUsers = store.getState().entities.users.allUsers;
  // const allUsers = useSelector(selectAllUsersMinimal); // tämä ei tarvinne olla selector, voi tehdä raskaaksi
  //*********** */
  //*********** */
  const messageItem = ({ item, index }) => {
    return (
      <View>
        {!allMessagesFetched && index === roomMessageIds.length - 1 && (
          <LoadingMessagesIndicator />
        )}
        {lastSeenMessageId === item && <NewMessagesIndicator />}
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

  const [allMessagesFetched, setAllMessagesFetched] = useState(false);
  useEffect(() => {
    //tätä ei aina pitäisi, eli tee reffillä

    if (messageSum === roomMessageIds?.length) {
      setAllMessagesFetched(true);
      //don't scroll when last messages fetched, so thats why return
      return;
    }
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

  useEffect(() => {
    var appStateListener = AppState.addEventListener("change", handleChange);

    nav.setOptions({
      headerRight: () => (
        <ShowSearchBarButton
          onPress={setShowSearchBar}
          onSearch={() => onSearch()}
        />
      ),
    });

    return () => {
      appStateListener?.remove();
    };
  }, []);
  //testiä
  //testiä
  //testiä
  //testiä
  //testiä

  //testiä
  //testiä
  //testiä
  //testiä
  //testiä

  const [lastSeenMessageId, setLatestSeenMessageId] = useState(null);

  let noMore = useRef(null);
  // console.log("Messagelist päivittyy");
  const trueUnread = useRef(0);
  const unread = useSelector(selectUnreadSum(roomId));

  const saveMessageSum = () => {
    const unreadMessagesSum = messageFuncs.getLastSeenMessage(
      store.getState(),
      roomId,
      roomMessageIds.length
    );

    if (unreadMessagesSum !== 0) {
      dispatch(
        saveLastSeenMessageSum(currentUserId, roomId, roomMessageIds.length)
      );
    }
  };

  const getLastSeenNow = () => {
    return store.getState().auth.currentUser.last_seen_messages[
      store
        .getState()
        .auth.currentUser.last_seen_messages.findIndex(
          (object) => object.roomId === roomId
        )
    ].lastSeenMessageSum;
  };

  const roomMessageSum = useSelector(selectRoomMessageSumByRoomId(roomId));
  const lastSeenMessagesNow = useSelector(selectLastSeenMessagesById(roomId));
  let unreadMessagesOnStart = useRef(null);
  // let [unreadMessagesOnStart, setUnreadMessagesOnStart] = useState(null);
  let lastOnStart = useRef(null);
  let showNewMessageIndicators = useRef(true);
  const handleChange = (newState) => {
    if (newState === "active") {
    } else if (newState === "background" || newState === "inactive") {
      unreadMessagesOnStart.current = null; // tämä lienee maku asia. Tulee esiin silloin, kun on huoneessa ja siellä on lukemattomia, kun menee pois ja tulee takaisin, miten näyttää
    }
  };

  useEffect(() => {
    // console.log(
    //   roomMessageSum,
    //   getLastSeenNow(),
    //   "pitääkö päivittää jos samat"
    // );
    let newMessages = roomMessageIds.length - getLastSeenNow();
    if (
      (!unreadMessagesOnStart.current ||
        newMessages > unreadMessagesOnStart.current) &&
      roomMessageSum !== getLastSeenNow()
    ) {
      unreadMessagesOnStart.current += newMessages;
      // console.log(newMessages, "newMessages");
      setLatestSeenMessageId(
        store.getState().entities.msgStore.allMessageIds[roomId][
          unreadMessagesOnStart.current - 1
        ]
      );
      // console.log(
      //   store.getState().entities.msgStore.allMessageIds[roomId][
      //     roomMessageIds.length - unreadMessagesOnStart.current - 1
      //   ]
      // );
    }

    // console.log(
    //   roomMessageSum,
    //   getLastSeenNow(),
    //   roomMessageIds.length,
    //   // store.getState().entities.msgStore.allMessageIds[roomId].length,
    //   "tässä viestit listal",
    //   "tässä luetut",
    //   "id pituus"
    //   // "id manuaalisesti"
    // );

    saveMessageSum();

    //kun tulee tänne, ei tee mitään ,josa erotus on 0
    //

    // if (trueUnread.current && unread === 0) {
    //   // setTimeout(() => {
    //   noMore.current = true;
    //   // }, 1000);
    // }

    //   if (unread > trueUnread.current && !noMore.current) {
    //     trueUnread.current = unread;
    //     unreadMessagesOnStart.current = trueUnread.current;
    //     setLatestSeenMessageId(
    //       store.getState().entities.msgStore.allMessageIds[roomId][
    //         trueUnread.current - 1
    //       ]
    //     );
    //   }

    //   // try {
    //   //   // const { messageSum, _id: roomId } = item.route.params;
    // if (!lastOnStart.current) {
    //   lastOnStart.current =
    //     store.getState().auth.currentUser.last_seen_messages[
    //       store
    //         .getState()
    //         .auth.currentUser.last_seen_messages.findIndex(
    //           (object) => object.roomId === roomId
    //         )
    //     ].lastSeenMessageSum;
    // }
    //   //   const unreadMessages = messagesssumm - lastOnStart.current;

    //   //   // // console.log(unreadMessages, messageSum, lastSeenMessagesNow, "joo joo");
    //   //   if (unreadMessages > 0) {
    //   //     console.log(unreadMessages, "lukemattomat");
    //   //     unreadMessagesOnStart.current = unreadMessages;
    //   //     setLatestSeenMessageId(roomMessageIds[unreadMessages - 1]);
    //   //   }
    //   // } catch (error) {
    //   //   console.log(error, "code 662112");
    //   // }
    // }, [unread, socket]);
  }, [roomMessageIds.length]);
  const socket = useSelector(selectSocket);
  // useLayoutEffect(() => {
  //   // console.log(
  //   //   "tee loppuun getUnseenMessageSum!!!!!!!!!!!!!!!!!!!!!!!!!!!, ei vielä be:ssä kuin alku users routerissa"
  //   // );
  //   // console.log(
  //   //   "tee loppuun getUnseenMessageSum!!!!!!!!!!!!!!!!!!!!!!!!!!!, ei vielä be:ssä kuin alku users routerissa"
  //   // );
  //   // console.log(
  //   //   "tee loppuun getUnseenMessageSum!!!!!!!!!!!!!!!!!!!!!!!!!!!, ei vielä be:ssä kuin alku users routerissa"
  //   // );
  //   // console.log(
  //   //   "tee loppuun getUnseenMessageSum!!!!!!!!!!!!!!!!!!!!!!!!!!!, ei vielä be:ssä kuin alku users routerissa"
  //   // );
  //   // console.log(
  //   //   "tee loppuun getUnseenMessageSum!!!!!!!!!!!!!!!!!!!!!!!!!!!, ei vielä be:ssä kuin alku users routerissa"
  //   // );
  //   // console.log(
  //   //   "tee loppuun getUnseenMessageSum!!!!!!!!!!!!!!!!!!!!!!!!!!!, ei vielä be:ssä kuin alku users routerissa"
  //   // );
  //   // console.log(
  //   //   "tee loppuun getUnseenMessageSum!!!!!!!!!!!!!!!!!!!!!!!!!!!, ei vielä be:ssä kuin alku users routerissa"
  //   // );
  //   // console.log(
  //   //   "tee loppuun getUnseenMessageSum!!!!!!!!!!!!!!!!!!!!!!!!!!!, ei vielä be:ssä kuin alku users routerissa"
  //   // );
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //ei siis näytä oikein, jos tulee sovellukseen pushin kautta
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   //huomioi, että jos on huone auki kun tulee, tai ei ole huone auki kun tulee
  //   try {
  //     // const { messageSum, _id: roomId } = item.route.params;
  //     const lastSeenMessagesNow =
  //       store.getState().auth.currentUser.last_seen_messages[
  //         store
  //           .getState()
  //           .auth.currentUser.last_seen_messages.findIndex(
  //             (object) => object.roomId === roomId
  //           )
  //       ].lastSeenMessageSum;
  //     console.log(lastSeenMessagesNow, "tämä on oikein, koska on se edellinen");
  //     console.log(
  //       messageSum,
  //       "tämä sitten taas tulee jälkijunassa, joten ei ole oikea. Eli ei ole ehtinyt päivittyä vielä. tee täysin uusiksi koko homma, ehkä be:stä hakee"
  //     );
  //     console.log(messagesssumm, messageSum, "entäs tämä");

  //     const unreadMessages = messageSum - lastSeenMessagesNow;
  //     unreadMessagesOnStart.current = unreadMessages;
  //     // console.log(unreadMessages, messageSum, lastSeenMessagesNow, "joo joo");
  //     setLatestSeenMessageId(roomMessageIds[unreadMessages - 1]);
  //   } catch (error) {
  //     console.log(error, "code 662112");
  //   }
  // }, []);

  const onScrollToBottom = (animate) => {
    msgListRef.current.scrollToIndex({
      animated: animate,
      index: 0,
    });
  };
  const keyExtractor = (item) => item;

  const [showLoader, setShowLoader] = useState(false);

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

  const onScrollToIndex = (replyMessageIndex, position) => {
    try {
      msgListRef.current.scrollToIndex({
        animated: true, // tämä voisi olla false
        index: replyMessageIndex,
        viewPosition: position,
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
        <AppSearchTextInput setShowSearchBar={setShowSearchBar} />
      )}
      {showUnreadMessageButton && unreadMessagesOnStart.current > 0 && (
        <UnreadMessagesButton
          unreadMessagesOnStart={unreadMessagesOnStart.current}
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
