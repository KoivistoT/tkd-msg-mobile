import React, { useState, useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { useSelector, useStore } from "react-redux";
import colors from "../../../config/colors";
import { selectSelectedMessage } from "../../../store/general";
import {
  selectMessageById,
  selectReactionsMessageById,
} from "../../../store/msgStore";
import { MemoMessageItemMainChild } from "./MessageItemMainChild";

const ANIMATION_DURATION = 250;
function MessageItemMain({
  messageId,
  roomId,
  currentUserId,
  onScrollToIndex = null,
  searchWord,
  index,
}) {
  let [elementHeight, setElemetHeight] = useState(57.5);

  let _animated = new Animated.Value(elementHeight);
  // let _animated = new Animated.Value(0);
  const rowStyles = [
    styles.row,
    // { opacity: _animated },
    {
      // transform: [
      //   { scale: _animated },
      //   {
      //     rotate: _animated.interpolate({
      //       // inputRange: [0, 1],
      //       // // outputRange: ["35deg", "0deg"],
      //       // // extrapolate: "clamp",
      //       // outputRange: ["90deg", "0deg"],
      //       // extrapolate: "clamp",
      //       inputRange: [0, 1],
      //       outputRange: [-100, 0],
      //     }),
      //   },
      // ],
      transform: [{ translateY: _animated }],
    },
  ];
  const store = useStore();
  console.log(
    "https://stackoverflow.com/questions/56020794/react-native-components-with-zindex-in-flatlist-does-not-seem-to-work"
  );
  // const selectedMessage = useSelector(selectSelectedMessage);
  // console.log("maini päi");
  // const [isCurrentMessageSelected, setIsCurrentMessageSelected] =
  //   useState(false);

  // useEffect(() => {
  //   setIsCurrentMessageSelected(selectedMessage === messageId);
  //   // return () => {
  //   //   dispatch(messageSelectionRemoved())
  //   // }
  // }, [selectedMessage]);
  const animated = new Animated.Value(0);
  const duration = 5000;
  const message = useSelector(selectMessageById(roomId, messageId));

  // const testi = useSelector(selectReactionsMessageById(roomId, messageId));
  // useEffect(() => {
  //   console.log("nyt päivitti");
  // }, [testi]);

  // console.log(testi, "message");
  // const message =
  //   store.getState().entities.msgStore.allMessages[roomId].messages[messageId];
  // const message =
  //   store.getState().entities.msgStore.allMessages[roomId].messages[messageId];
  const [bounceValue, setBounceValue] = useState(new Animated.Value(300));
  // useEffect(() => {
  //   Animated.timing(_animated, {
  //     toValue: 0,
  //     duration: ANIMATION_DURATION,
  //     useNativeDriver: true,
  //   }).start();
  // }, [index]);

  const sentBy = message.postedByUser === currentUserId ? "me" : "otherUser";
  const allUsers = store.getState().entities.users.allUsers;

  const trans = {
    transform: [{ translateX: _animated }],
  };
  // console.log(messageId);
  return (
    // <Animated.View
    //   style={[rowStyles]}
    //   // onLayout={(event) => {
    //   //   var { x, y, width, height } = event.nativeEvent.layout;
    //   //   setElemetHeight(height);
    //   //   // console.log(height);
    //   // }}
    // >
    // {/* <Animated.View style={[{ transform: [{ translateX: bounceValue }] }]}> */}
    // <View
    //   style={{
    //     position:
    //       messageId === "625537b0de70ac59a4f011f6" ? "absolute" : "relative",
    //     bottom: messageId === "625537b0de70ac59a4f011f6" ? -40 : 0,
    //     right: messageId === "625537b0de70ac59a4f011f6" ? 80 : 0,
    //     backgroundColor: messageId === "625537b0de70ac59a4f011f6" ? "red" : "",
    //     zIndex: messageId === "625537b0de70ac59a4f011f6" ? 200000 : 2,
    //   }}
    // >
    <MemoMessageItemMainChild
      message={message}
      searchWord={searchWord}
      sentBy={sentBy}
      allUsers={allUsers}
      onScrollToIndex={onScrollToIndex}
    />
    // </View>
    // {/* </Animated.View> */}
  );
}

function areEqual(prevProps, nextProps) {
  // console.log("täällä päivittää joo");
  try {
    if (
      prevProps.messageId === nextProps.messageId &&
      prevProps.searchWord === nextProps.searchWord
      //  &&
      // prevProps.index === nextProps.index
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error, "code 99e332");
  }
}

const styles = StyleSheet.create({
  me: {
    marginTop: 4,
    marginBottom: 4,
    alignSelf: "flex-end",
    backgroundColor: colors.light,
    padding: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    maxWidth: "82%",
    borderBottomLeftRadius: 5,
    // shadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  optionIcon: {
    paddingTop: 10,
    paddingRight: 20,
  },
  optionButtons: {
    backgroundColor: "red",
  },

  otherUser: {
    marginTop: 4,
    marginBottom: 4,
    alignSelf: "flex-start",
    backgroundColor: colors.light,
    padding: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    maxWidth: "82%",
    borderBottomRightRadius: 5,
    // shadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
export const MemoMessageItemMain = React.memo(MessageItemMain, areEqual);
// export default MessageItemMain;
