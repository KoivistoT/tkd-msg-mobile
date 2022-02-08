import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Screen from "../app/components/Screen";
import { userLoggedOut } from "../store/currentUser";
import { disconnectSocket } from "../store/socket";
import routes from "../app/navigation/routes";

function RoomsScreen({ navigation }) {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.entities.rooms);

  const logout = () => {
    dispatch(disconnectSocket());
    dispatch(userLoggedOut());
  };

  return (
    <Screen>
      {!rooms.rooms && (
        <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />
      )}
      {rooms.rooms && (
        <FlatList
          data={Object.values(rooms.rooms).sort(function (a, b) {
            var nameA = a.roomName;
            var nameB = b.roomName;
            // console.log(a, b);
            if (nameA > nameB) {
              return 1;
            }
            if (nameA < nameB) {
              return -1;
            }
            return 0;
          })}
          keyExtractor={(room) => room._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginBottom: 10 }}
              onPress={() => navigation.navigate(routes.MESSAGE_SCREEN, item)}
            >
              <Text
                style={{
                  color: "black",
                  backgroundColor: "green",
                  padding: 10,
                }}
                key={item._id}
              >
                {item.roomName}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <View>
        <TouchableOpacity onPress={() => logout()}>
          <Text>kirjaudu ulos</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomsScreen;
