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
import { isLoggedIn, logout, selectToken, userLoggedOut } from "../store/auth";
import { getBugs, loadBugs } from "../store/bugs";
import { getMessagesbyId } from "../store/chats";

function MessageScreen({}) {
  const [message, setMessage] = useState("");
  const onChangeText = (text) => setMessage(text);

  const dispatch = useDispatch();

  const chatMessages = useSelector((state) => state.entities.chats);

  // alert(
  //   "https://medium.com/react-native-mastery/buiding-chat-app-with-react-native-and-socket-io-6f9f9e503003"
  // );

  useEffect(() => {
    // tämä dispatch vai mitä
    const chatId = "61c07dc42815a00142a0b600";
    dispatch(getMessagesbyId(chatId));
  }, []);
  console.log(chatMessages.messages.messages);
  return (
    <View>
      <View
        style={{
          borderWidth: 1,
          width: 300,
          height: 500,
          color: "black",
        }}
      >
        <FlatList
          data={chatMessages.messages.messages}
          keyExtractor={(message) => message._id}
          renderItem={({ item }) => (
            <Text
              style={{
                color: "black",
                backgroundColor: "blue",
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
          style={{ backgroundColor: "lightgrey", width: 300, height: 30 }}
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
    </View>
  );
}

const styles = StyleSheet.create({});
export default MessageScreen;
