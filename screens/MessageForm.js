import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { activeRoomIdResived, activeRoomIdClearer } from "../store/rooms";
import { sendMessage } from "../store/msgStore";

function MessageForm({ item }) {
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const onChangeText = (text) => setMessage(text);
  const roomId = item.route.params._id;

  useEffect(() => {
    dispatch(activeRoomIdResived(roomId));

    return () => {
      dispatch(activeRoomIdClearer());
    };
  }, []);

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
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
export default MessageForm;
