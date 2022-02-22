import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "../store/currentUser";
import { sendMessage } from "../store/msgStore";

function MessageForm({ item }) {
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const onChangeText = (text) => setMessage(text);
  const roomId = item.route.params._id;

  const send = () => {
    dispatch(sendMessage(message, roomId));
  };

  return (
    <>
      <View>
        <TextInput
          style={{ backgroundColor: "coral", width: 300, height: 30 }}
          placeholderTextColor={"black"}
          onChangeText={(text) => onChangeText(text)}
        />

        <Button
          title="Send message"
          onPress={() => {
            send();
          }}
        />
        <TouchableOpacity onPress={() => dispatch(userLoggedOut())}>
          <Text>kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
export default MessageForm;
