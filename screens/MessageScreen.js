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
} from "../store/messages";
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
    socket.emit("chat message", { message, roomId });
    if (getErrorMessage()(store.getState())) {
      console.log("Viestin lähetys epäonnistui");
    } else {
      console.log("Viestin lähetys onnistui!!!");
    }
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
      // alert("uusi viesti tuli");
      alert("tämä alussa socketissa kuuntelee, ei täältä");
      dispatch(newMessageResived(message.message));
      // dispatch(getMessagesbyId(roomId));
    });
    socket.emit("getUsers");
    socket.on("users live", (users) => {
      setUsersLive(users.users);
    });
    dispatch(getMessagesbyId(roomId));
    return () => {
      socket.emit("unsubscribe", roomId);
      socket.off("new message");
      socket.off("users live");
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

  const [usersLive, setUsersLive] = useState([]);
  // console.log(roomMessages.messages, "Täältä huoneesta");
  return (
    <Screen>
      {usersLive.map((item, index) => (
        <Text key={index}>{item.userId}</Text>
      ))}
      <View
        style={{
          borderWidth: 1,
          width: 300,
          height: 400,
          color: "black",
        }}
      >
        {/* {roomMessages2 && ( */}

        <FlatList
          data={roomMessages2.messages}
          keyExtractor={(message) => message._id}
          renderItem={messageItem}
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
