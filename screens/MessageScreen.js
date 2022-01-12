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
import { useDispatch, useSelector, useStore } from "react-redux";
import Screen from "../app/components/Screen";
import {
  isLoggedIn,
  logout,
  selectToken,
  userLoggedOut,
} from "../store/currentUser";
import { getErrorMessage, getMessagesbyId, sendMessage } from "../store/rooms";

function MessageScreen(item) {
  // messageForm pitää olla erikseen, jotta ei päivitä viestilsitaa
  const [message, setMessage] = useState("");
  const onChangeText = (text) => setMessage(text);
  const roomId = item.route.params._id;
  const store = useStore();
  const dispatch = useDispatch();

  const roomMessages = useSelector((state) => state.entities.rooms);

  const send = async () => {
    await dispatch(sendMessage(message, roomId));

    if (getErrorMessage()(store.getState())) {
      console.log("Viestin lähetys epäonnistui");
    } else {
      console.log("Viestin lähetys onnistui!!!");
    }
  };

  useEffect(() => {
    const roomId = item.route.params._id;
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
        {roomMessages.messages && (
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
        )}
      </View>
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
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default MessageScreen;
