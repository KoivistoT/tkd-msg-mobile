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
  selectAllUsersMedium,
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
import OnlineIndicator from "../app/components/OnlineIndicator";
import userFuncs from "../utility/userFuncs";
import { selectCurrentUserId } from "../store/currentUser";

function ContactsScreen({ navigation, showInfoButton = true }) {
  const dispatch = useDispatch();
  const store = useStore();
  const currentUserId = selectCurrentUserId(store);
  const allUsers = useSelector(selectAllUsersMedium);
  const usersOnline = useSelector(selectUsersOnline);
  const allRooms = useSelector(selectUserRooms);
  // console.log(usersOnline, "userit online");
  const listKeyExtractor = (data) => data._id;

  console.log("tämä päitty");
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
        onPress={() => onStartConversation(item)}
        style={{ height: 50, justifyContent: "center" }}
        // onPress={() => navigation.navigate(routes.USER_DETAILS_SCREEN, item)}
      >
        <View
          style={{
            backgroundColor: item.status === "archived" ? "yellow" : "white",
            flexDirection: "row",
            marginLeft: 10,
            marginBottom: 15,
          }}
        >
          <View
            style={[
              styles.onlineIndicator,
              {
                backgroundColor:
                  colors[
                    usersOnline.includes(item._id) ? "success" : "lightgrey"
                  ],
              },
            ]}
          />

          <View>
            <AppText style={styles.name}>{userFuncs.fullName(item)}</AppText>
          </View>
          {showInfoButton && (
            <TouchableOpacity
              style={{
                position: "absolute",
                padding: 20,
                paddingRight: 10,
                right: 0,
                alignSelf: "center",
              }}
              activeOpacity={1}
              onPress={() =>
                navigation.navigate(routes.USER_INFO_CARD_SCREEN, item._id)
              }
            >
              <MaterialCommunityIcons
                name="badge-account-horizontal-outline"
                size={25}
                color={colors.dark}
              />
            </TouchableOpacity>
          )}
        </View>
        <ListItemSeparator />
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      {allUsers && (
        <FlatList
          style={{ paddingTop: 10 }}
          data={Object.values(allUsers)}
          maxToRenderPerBatch={15}
          initialNumToRender={15}
          windowSize={15}
          keyExtractor={listKeyExtractor}
          renderItem={listItem}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  onlineIndicator: {
    width: 14,
    alignSelf: "center",
    marginRight: 10,
    height: 14,

    borderRadius: 7,
  },
});
export default ContactsScreen;
