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
  getToken,
  isLoggedIn,
  logout,
  selectToken,
  userLoggedOut,
} from "../store/auth";
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
  const [message, setMessage] = useState("jaaha");
  const onChangeText = (text) => setMessage(text);

  const dispatch = useDispatch();
  const store = useStore();

  const rooms = useSelector((state) => state.entities.rooms);

  useEffect(() => {
    // tämä dispatch vai mitä
  }, []);
  const sendMessageTest = async () => {
    await dispatch(sendMessage());

    if (getErrorMessage()(store.getState())) {
      console.log("on error");
      console.log("triggeröi error message");
      dispatch(messageSendErrorCleared());
    } else {
      console.log("Ei ole nyt");
    }
  };
  const logout = () => {
    dispatch(disconnectSocket());
    dispatch(userLoggedOut());
  };
  //   console.log(rooms.rooms, "täsät");

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
          data={rooms.rooms}
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
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            sendMessageTest();
          }}
        >
          <Text>lähetä viesti</Text>
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
