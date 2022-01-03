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
import { getAllRooms, getMessagesbyId } from "../store/rooms";

function RoomsScreen({}) {
  const [message, setMessage] = useState("");
  const onChangeText = (text) => setMessage(text);

  const dispatch = useDispatch();

  const rooms = useSelector((state) => state.entities.rooms);

  useEffect(() => {
    // tämä dispatch vai mitä

    dispatch(getAllRooms());
  }, []);
  //   console.log(rooms.rooms, "täsät");
  return (
    <View>
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
              onPress={() => console.log(item.name)}
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
        <TouchableOpacity onPress={() => dispatch(userLoggedOut())}>
          <Text>kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
export default RoomsScreen;
