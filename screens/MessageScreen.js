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
import { userLoggedOut } from "../store/currentUser";
import { getRoomMessagesByRoomId, sendMessage } from "../store/msgStore";
import { selectSocket } from "../store/socket";

function MessageScreen(item) {
  // messageForm pitää olla erikseen, jotta ei päivitä viestilsitaa
  const [message, setMessage] = useState("");
  const roomId = item.route.params._id;

  const dispatch = useDispatch();
  const onChangeText = (text) => setMessage(text);

  const roomMessages = useSelector(getRoomMessagesByRoomId(roomId));
  const socket = useSelector((state) => selectSocket(state));

  const send = () => {
    dispatch(sendMessage(message, roomId));
  };

  useEffect(() => {
    socket.emit("getUsers");
    socket.on("users live", (data) => {
      setUsersLive(data.users);
    });

    return () => {
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
        {roomMessages && (
          <FlatList
            data={Object.values(roomMessages).sort(function (a, b) {
              var nameA = a.createdAt;
              var nameB = b.createdAt;
              // console.log(a, b);
              if (nameA > nameB) {
                return 1;
              }
              if (nameA < nameB) {
                return -1;
              }
              return 0;
            })}
            keyExtractor={(message) => message._id}
            renderItem={messageItem}
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
