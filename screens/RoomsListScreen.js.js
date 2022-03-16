import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  AppState,
} from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import Screen from "../app/components/Screen";
import {
  bucketCleared,
  getChangeBucket,
  selectChangeBucket,
  userLoggedOut,
} from "../store/currentUser";
import {
  createSocketConnection,
  disconnectSocket,
  selectSocket,
} from "../store/socket";
import { MemoRoomListItemMain } from "../app/components/RoomListItemMain";
import {
  roomLatestMessageChanged,
  roomStateCleared,
  selectAllActiveRoomsIds,
  selectAllActiveRoomsIdsOld,
} from "../store/rooms";
import { MemoNewDirectRoomModal } from "../app/components/modals/NewDirectRoomModal";
import { MemoCreateChannelModal } from "../app/components/modals/CreateChannelModal";
import { usersOnlineResived } from "../store/users";
import { newMessageResived } from "../store/msgStore";
import messagesApi from "../api/messages";
function RoomsListScreen({ navigation }) {
  const dispatch = useDispatch();
  const store = useStore();
  const socket = useSelector(selectSocket);
  const currentUserId = store.getState().auth.currentUser._id;
  // const allActiveRoomsIds = useSelector(selectAllActiveRoomsIdsOld);
  const allActiveRoomsIds = useSelector(selectAllActiveRoomsIds);
  // const changeBucket = useSelector(selectChangeBucket);

  // if (changeBucket && changeBucket.length !== 0) {
  //   console.log(changeBucket);
  //   if (changeBucket && changeBucket.length !== 0) {
  //     console.log("täällä nyt toimii");
  //     changeBucket.forEach((element) => {
  //       const { type, data } = element;
  //       console.log(type, "tämä on type");
  //       if (type === "new message") {
  //         dispatch(newMessageResived(data));
  //       }
  //       if (type === "roomLatestMessageChanged") {
  //         dispatch(roomLatestMessageChanged(data));
  //       }
  //     });
  //     dispatch(bucketCleared());
  //   }
  // }
  const logout = () => {
    // userOffline();

    dispatch(disconnectSocket());
    dispatch(roomStateCleared());
    dispatch(userLoggedOut());
  };

  const userOnline = () => {
    socket.emit("userOnline", currentUserId);
    socket.on("userOnline", (data) => {
      dispatch(usersOnlineResived(data));
    });
  };

  const userOffline = () => {
    socket.emit("userOffline", currentUserId);
    socket.off("userOnline");
  };

  const socketConnection = useRef(false);
  const handleChange = (newState) => {
    if (newState === "active") {
      dispatch(getChangeBucket(currentUserId));

      if (!socket) {
        dispatch(createSocketConnection());
        socketConnection.current = true;
      }

      // userOnline();
    } else if (newState === "background" || newState === "inactive") {
      // userOffline();
      // if (socket) {
      if (socketConnection.current) {
        dispatch(disconnectSocket());
        socketConnection.current = false;
      }
      // }
    }
  };

  const addListener = async () => {
    const result = await messagesApi.addMessageListener();
    console.log(result);
  };
  useEffect(() => {
    // addListener();
    // if (socket) {
    // handleChange(AppState.currentState);
    var appStateListener = AppState.addEventListener("change", handleChange);
    // }
    return () => {
      appStateListener?.remove();
    };
  }, []);

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

  // const sortRoomsByLastMessage = () => {
  //   allActiveRoomsIds.sort(function (a, b) {
  //     console.log(a, b);
  //     var nameA = a[field];
  //     var nameB = b[field];

  //     if (nameA > nameB) {
  //       return 1;
  //     }
  //     if (nameA < nameB) {
  //       return -1;
  //     }
  //     return 0;
  //   });
  // };
  // sortRoomsByLastMessage();
  return (
    <Screen>
      {/* {!socket && ( */}
      {!allActiveRoomsIds && (
        <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />
      )}
      {/* ehkä ei tarpeen olla kaikki varmistukset, ei päivitä alussa roomListItemiä niin montaa kertaa, mutta ehkä ei haittaa... */}
      {/* {socket && allActiveRoomsIds && ( */}
      {allActiveRoomsIds && (
        <FlatList
          // data={sortObjectsByfield(userRooms, "roomName")}

          data={allActiveRoomsIds}
          keyExtractor={keyExtractor}
          renderItem={listItem}
        />
      )}

      <View>
        <TouchableOpacity onPress={() => logout()}>
          <Text>kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomsListScreen;
