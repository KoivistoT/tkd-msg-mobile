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
import { useDispatch, useSelector } from "react-redux";
import Screen from "../app/components/Screen";
import { isLoggedIn, logout, selectToken, userLoggedOut } from "../store/auth";
import { getMessagesbyId } from "../store/rooms";

function MessageScreen({}) {
  const [message, setMessage] = useState("");
  const onChangeText = (text) => setMessage(text);

  const dispatch = useDispatch();

  const roomMessages = useSelector((state) => state.entities.rooms);

  // alert(
  //   "https://medium.com/react-native-mastery/buiding-chat-app-with-react-native-and-socket-io-6f9f9e503003"
  // );
  // console.log(
  //   "täältä jos monta huonetta https://socket.io/docs/v4/server-api/"
  // );
  useEffect(() => {
    // tämä dispatch vai mitä
    const roomId = "61d35b8145d1e3e2bc83ff0c";
    dispatch(getMessagesbyId(roomId));
  }, []);

  return (
    <Screen>
      <View
        style={{
          borderWidth: 1,
          width: 300,
          height: 500,
          color: "black",
        }}
      >
        <FlatList
          data={roomMessages.messages.messages}
          keyExtractor={(message) => message._id}
          renderItem={({ item }) => (
            <Text
              style={{
                color: "black",
                backgroundColor: "white",
              }}
              key={item._id}
            >
              {item.messageBody}
            </Text>
          )}
        />
      </View>
      <View>
        <TextInput
          style={{ backgroundColor: "coral", width: 300, height: 30 }}
          placeholderTextColor={"black"}
          onChangeText={(text) => onChangeText(text)}
        />

        <Button
          title="Send message"
          onPress={async () => {
            const result = await messagesApi.sendMessage();
            console.log(result);
          }}
        />
        <TouchableOpacity onPress={() => dispatch(userLoggedOut())}>
          <Text>kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default MessageScreen;
