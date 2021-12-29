import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  Text,
  TextInput,
} from "react-native";
import messagesApi from "../api/messages";

function AppTextInput({}) {
  const [message, setMessage] = useState("");
  const onChangeText = (text) => setMessage(text);

  const [messages, setMessages] = useState([]);
  // alert(
  //   "https://medium.com/react-native-mastery/buiding-chat-app-with-react-native-and-socket-io-6f9f9e503003"
  // );
  useEffect(() => {
    // loadMessages();
    // addListener();
  }, []);

  const addListener = async () => {
    const result = await messagesApi.addMessageListener();
    console.log(result);
  };
  const loadMessages = async () => {
    const response = await messagesApi.getMessages();
    setMessages(response.data);

    // console.log(response.data[1].message);
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: "red",
          width: 100,
          height: 500,
          color: "black",
        }}
      >
        <FlatList
          data={messages}
          keyExtractor={(message) => message._id}
          renderItem={({ item }) => (
            <Text
              style={{
                color: "black",
                backgroundColor: "blue",
              }}
              key={item.id}
            >
              {item.message}
            </Text>
          )}
        />
      </View>
      <View>
        <TextInput
          style={{ backgroundColor: "red", width: 200, height: 30 }}
          placeholderTextColor={"black"}
          onChangeText={(text) => onChangeText(text)}
        />
        <Button
          title="Send nessage"
          onPress={async () => {
            await messagesApi.addMessage(message);
            loadMessages();
          }}
        />
        <Button
          title="Send nessage auth"
          onPress={async () => {
            const result = await messagesApi.sendMessage();
            console.log(result);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
export default AppTextInput;
