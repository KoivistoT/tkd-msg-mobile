import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import messagesApi from "../api/messages";
import { useDispatch, useSelector, useStore } from "react-redux";
import Screen from "../app/components/Screen";
import {
  getCurrentUserRooms,
  getToken,
  isLoggedIn,
  logout,
  selectToken,
  userLoggedOut,
} from "../store/currentUser";
import {
  getAllRooms,
  getErrorMessage,
  getMessagesbyId,
  messageSendErrorCleared,
  selectErrorMessage,
  sendMessage,
  sendMessage2,
} from "../store/rooms";
import { disconnectSocket, selectSocket } from "../store/socket";
import routes from "../app/navigation/routes";

function RoomsScreen({ navigation }) {
  const dispatch = useDispatch();
  const store = useStore();

  const rooms = useSelector((state) => state.entities.rooms);
  // const userRooms = useSelector(getCurrentUserRooms);
  const socket = useSelector((state) => selectSocket(state));
  // const socket = store.getState().entities.socket.connection;

  useEffect(() => {
    // tämä dispatch vai mitä
  }, []);
  // console.log(
  //   "tuleeko viestit erikseen vai suoraan huoneeseen? Entä membersit, oma vai huoneeseen."
  // );
  const sendMessageTest = async () => {
    await dispatch(sendMessage());

    if (getErrorMessage()(store.getState())) {
      console.log("Viestin lähetys epäonnistui");
    } else {
      console.log("Onnistui. Tähän reset form");
    }
  };
  const logout = () => {
    dispatch(disconnectSocket());
    dispatch(userLoggedOut());
  };
  //   console.log(rooms.rooms, "täsät");
  const sendForUsers = () => {
    //tähän se miten yhdelle lähettää
    const roomId = "61e6a80eb30d002e91d67b5a";
    socket.emit("id connect", { users: ["61e6a7fdb30d002e91d67b53"], roomId });
  };
  return (
    <Screen>
      <View
        style={{
          width: 300,
          height: 500,
          color: "black",
        }}
      >
        <FlatList
          data={Object.values(rooms.rooms)}
          keyExtractor={(room) => room._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginBottom: 10 }}
              onPress={() => navigation.navigate(routes.MESSAGE_SCREEN, item)}
            >
              <Text
                style={{
                  color: "black",
                  backgroundColor: "green",
                  padding: 10,
                }}
                key={item._id}
              >
                {item.roomName}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View>
        <TouchableOpacity onPress={() => sendForUsers()}>
          <Text>send something by userID</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => logout()}>
          <Text>kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomsScreen;
