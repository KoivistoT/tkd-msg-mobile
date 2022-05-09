import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { selectAllUsersMedium, selectUsersOnline } from "../store/users";
import colors from "../config/colors";
import routes from "../app/navigation/routes";
import { createPrivateRoom, selectUserRooms } from "../store/rooms";
import roomFuncs from "../utility/roomFuncs";
import userFuncs from "../utility/userFuncs";
import { selectCurrentUserId } from "../store/currentUser";
import { startLoad } from "../store/general";
import AppTouchableIcon from "../app/components/AppTouchableIcon";

function ContactsScreen({ navigation, showInfoButton = true }) {
  const dispatch = useDispatch();
  const store = useStore();
  const currentUserId = selectCurrentUserId(store);
  const allUsers = useSelector(selectAllUsersMedium);
  const usersOnline = useSelector(selectUsersOnline);
  const allRooms = useSelector(selectUserRooms);
  const listKeyExtractor = (data) => data._id;

  const onStartPrivateChat = (item) => {
    dispatch(startLoad("Opening chat"));
    roomFuncs.startPrivateConversation(item, currentUserId, allRooms, () =>
      dispatch(createPrivateRoom(currentUserId, item._id))
    );
  };

  const listItem = ({ item }) => {
    if (item.status === "archived" || item.status === "deleted") {
      return;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => onStartPrivateChat(item)}
        style={styles.buttonRow}
      >
        <View style={styles.container}>
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

          <AppText style={styles.name}>{userFuncs.fullName(item)}</AppText>
          {showInfoButton && (
            <AppTouchableIcon
              source="mci"
              onPress={() =>
                navigation.navigate(routes.USER_INFO_CARD_SCREEN, item._id)
              }
              style={styles.icon}
              containerStyle={styles.iconContainer}
              name="badge-account-horizontal-outline"
            />
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
  container: {
    flexDirection: "row",
    marginLeft: 10,
    marginBottom: 15,
  },
  buttonRow: { height: 50, justifyContent: "center" },
  onlineIndicator: {
    width: 14,
    alignSelf: "center",
    marginRight: 10,
    height: 14,

    borderRadius: 7,
  },
  icon: { padding: 15 },
  iconContainer: {
    position: "absolute",
    padding: 20,
    paddingRight: 10,
    right: 0,
    alignSelf: "center",
  },
});
export default ContactsScreen;
