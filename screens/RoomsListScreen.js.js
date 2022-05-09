import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  AppState,
} from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import Screen from "../app/components/Screen";
import { selectCurrentUserId } from "../store/currentUser";
import { useIsFocused } from "@react-navigation/native";
import {
  createSocketConnection,
  disconnectSocket,
  selectSocket,
} from "../store/socket";
import { MemoRoomListItemMain } from "../app/components/RoomList/RoomListItemMain";
import {
  activeRoomIdCleared,
  selectAllActiveRoomsIds,
  selectRoomsFetched,
} from "../store/rooms";

import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import { messageSelectionRemoved } from "../store/general";

function RoomsListScreen({ navigation }) {
  const dispatch = useDispatch();
  const store = useStore();
  const socket = useSelector(selectSocket);
  const isFocused = useIsFocused();
  const currentUserId = selectCurrentUserId(store);
  const allActiveRoomsIds = useSelector(selectAllActiveRoomsIds);
  const roomsFetched = useSelector(selectRoomsFetched);
  const socketConnection = useRef(true);

  const handleChange = (newState) => {
    if (newState === "active") {
      if (!socket) {
        dispatch(createSocketConnection());
        socketConnection.current = true;
      }
    } else if (newState === "background" || newState === "inactive") {
      if (socketConnection.current) {
        dispatch(disconnectSocket(currentUserId));
        socketConnection.current = false;
      }
    }
  };

  useEffect(() => {
    dispatch(activeRoomIdCleared());
    var appStateListener = AppState.addEventListener("change", handleChange);

    return () => {
      appStateListener?.remove();
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      dispatch(messageSelectionRemoved());
    }
  }, [isFocused]);

  const keyExtractor = (id) => id;
  const listItem = ({ item }) => {
    return (
      <MemoRoomListItemMain
        navigation={navigation}
        roomId={item}
        currentUserId={currentUserId}
      />
    );
  };

  return (
    <Screen>
      {!roomsFetched && (
        <View style={styles.loadingChats}>
          <ActivityIndicator />
          <AppText style={styles.loadingChatsText}>Loading chats</AppText>
        </View>
      )}
      {allActiveRoomsIds && (
        <FlatList
          style={styles.roomsList}
          ItemSeparatorComponent={ListItemSeparator}
          data={allActiveRoomsIds}
          keyExtractor={keyExtractor}
          renderItem={listItem}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingChats: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loadingChatsText: { marginLeft: 10 },
  roomsList: { paddingTop: 10 },
});
export default RoomsListScreen;
