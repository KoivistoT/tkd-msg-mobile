import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";
import { MemoMessageItemMain } from "../messageItems/MessageItemMain";
import MessageItemImage from "./MessageItemImage";

import { selectAllUsersMinimal } from "../../../store/users";
import Screen from "../Screen";
import { selectRoomMembersById } from "../../../store/rooms";
import { getOneMessageById, selectMessageById } from "../../../store/msgStore";
function ReadByList(item) {
  const { _id: messageId, roomId, messageBody } = item.route.params;

  const store = useStore();
  const dispatch = useDispatch();
  const currentUserId = store.getState().auth.currentUser._id;
  const roomMemebers = useSelector(selectRoomMembersById(roomId));
  const allUsersData = useSelector(selectAllUsersMinimal);
  const currentMessage = useSelector(selectMessageById(roomId, messageId));

  useEffect(() => {
    dispatch(getOneMessageById(roomId, messageId));
  }, []);

  const getIsSeenData = (userId) => {
    const index = currentMessage.readByRecipients.findIndex(
      (item) => item.readByUserId === userId
    );
    if (index === -1) return "-";
    else return currentMessage.readByRecipients[index].readAt;
  };

  const listItem = ({ item }) => {
    if (item === currentUserId) return;

    return (
      <View style={{ flexDirection: "row" }} key={item.id}>
        {allUsersData && (
          <Text
            style={{
              color: "black",
              backgroundColor: "green",
            }}
          >
            {allUsersData
              ? `${allUsersData[item].firstName} ${allUsersData[item].lastName}`
              : "unknown user"}
          </Text>
        )}
        {currentMessage ? (
          <Text
            style={{
              color: "black",
              backgroundColor: "blue",
            }}
            key={item.id}
          >
            {getIsSeenData(item)}
          </Text>
        ) : (
          <ActivityIndicator
            animating={true}
            size="small"
            style={{
              opacity: 1,
              marginTop: 20,
            }}
            color="#999999"
          />
        )}
      </View>
    );
  };

  return (
    <Screen>
      <AppText>
        Tähän paremmin tämä, kun selkeä, millainen on viesti ja sit poistaa
        tietyt ominaisuudet, jos näkyy, kuten delete message
      </AppText>
      <AppText style={{ backgroundColor: "red" }}>
        Tämä on viesti: {messageBody}
      </AppText>
      <AppText>kukas lukenut</AppText>
      <FlatList
        data={roomMemebers}
        keyExtractor={(member) => member._id}
        renderItem={listItem}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

function areEqual(prevProps, nextProps) {
  return true;
}

export const MemoReadByList = React.memo(ReadByList, areEqual);
