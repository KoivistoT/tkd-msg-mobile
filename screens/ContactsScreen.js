import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import {
  allUsers,
  selectAllUsers,
  selectAllUsersMinimal,
  selectUsersOnline,
} from "../store/users";
import colors from "../config/colors";
import routes from "../app/navigation/routes";
import AppButton from "../app/components/AppButton";
import {
  createPrivateRoom,
  selectUserRooms,
  setRoomLoadingToFalse,
  setRoomLoadingToTrue,
} from "../store/rooms";
import sortArray from "../utility/sortArray";
import roomFuncs from "../utility/roomFuncs";

function ContactsScreen({ navigation }) {
  const dispatch = useDispatch();
  const store = useStore();
  const currentUserId = store.getState().auth.currentUser._id;
  const allUsers = useSelector(selectAllUsersMinimal);
  const usersOnline = useSelector(selectUsersOnline);
  const allRooms = useSelector(selectUserRooms);
  // console.log(usersOnline, "userit online");
  const listKeyExtractor = (data) => data._id;

  const onStartConversation = (item) => {
    roomFuncs.startPrivateConversation(item, currentUserId, allRooms, () =>
      dispatch(createPrivateRoom(currentUserId, item._id))
    );
  };

  const listItem = ({ item }) => {
    if (item.status === "archived" || item.status === "deleted") return;

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate(routes.USER_DETAILS_SCREEN, item)}
      >
        <View
          style={{
            backgroundColor: item.status === "archived" ? "yellow" : "white",
          }}
        >
          {usersOnline && usersOnline.includes(item._id) && (
            <AppText style={styles.onlineIndicator}>Online</AppText>
          )}
          <View>
            <AppText style={styles.name}>{item.firstName}</AppText>
          </View>
          <AppButton
            title="uusi keskustelu"
            onPress={() => onStartConversation(item)}
          />
          <MaterialCommunityIcons
            name="chevron-right"
            size={25}
            color={colors.dark}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      {allUsers && (
        <FlatList
          ItemSeparatorComponent={() => <ListItemSeparator />}
          data={Object.values(allUsers)}
          bounces={false}
          keyExtractor={listKeyExtractor}
          renderItem={listItem}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  onlineIndicator: {
    backgroundColor: colors.danger,
  },
});
export default ContactsScreen;
