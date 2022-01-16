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
import {
  getErrorMessage,
  getMessagesbyId,
  getRoomMessages,
  newMessageResived,
  sendMessage,
} from "../store/rooms";
import { disconnectSocket, selectSocket } from "../store/socket";

function MessageScreen(item) {
  // messageForm pitää olla erikseen, jotta ei päivitä viestilsitaa
  const [message, setMessage] = useState("");
  const onChangeText = (text) => setMessage(text);
  const roomId = item.route.params._id;
  const store = useStore();
  const dispatch = useDispatch();

  const roomMessages2 = useSelector(getRoomMessages);

  const socket = useSelector((state) => selectSocket(state));
  const send = async () => {
    await dispatch(sendMessage(message, roomId));

    if (getErrorMessage()(store.getState())) {
      console.log("Viestin lähetys epäonnistui");
    } else {
      console.log("Viestin lähetys onnistui!!!");
    }
  };
  const sendEmit = () => {
    const msg = "tämä on viesti mobiilista";
    const messageData = { roomId: item.route.params._id, msg };

    socket.emit("chat message", messageData);
  };
  useEffect(() => {
    const roomId = item.route.params._id;
    // const listener = (msg) => {
    //   console.log(msg, "lkjlj");
    // };

    // socket.emit("subscribe", roomId);
    // socket.emit("login", { name: "jaaha", roomId: roomId }, (error) => {
    //   if (error) {
    //     console.log(error, "tää error");
    //   }
    // });

    // socket.emit("chat message", "täältä");
    // socket.emit("chat message", "ee");
    socket.emit("subscribe", roomId);
    socket.on("new message", (message) => {
      console.log("tässä käy tämä", message);
      dispatch(newMessageResived(message.message));
      // dispatch(getMessagesbyId(roomId));
    });
    dispatch(getMessagesbyId(roomId));
    return () => {
      console.log("on täällä");
      socket.emit("unsubscribe", roomId);
      socket.off("new message");
    };
  }, []);

  const messageItem = ({ item }) => (
    <Text
      style={{
        color: "black",
        backgroundColor: "white",
      }}
      key={item._id}
    >
      {item.messageBody}
    </Text>
  );

  // console.log(roomMessages.messages, "Täältä huoneesta");
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
        {/* {roomMessages2 && ( */}
        {roomMessages2.messages && (
          <Text style={{ color: "red" }}>
            {
              roomMessages2.messages[roomMessages2.messages.length - 1]
                .messageBody
            }
            viimeisin
          </Text>
        )}

        <FlatList
          data={roomMessages2.messages}
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
        {/* )} */}
      </View>
      <View>
        <TextInput
          style={{ backgroundColor: "coral", width: 300, height: 30 }}
          placeholderTextColor={"black"}
          onChangeText={(text) => onChangeText(text)}
        />
        <Button
          title="Send emit"
          onPress={() => {
            sendEmit();
          }}
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
