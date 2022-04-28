import React, { useState } from "react";
import { StyleSheet, FlatList, View } from "react-native";

import { useDispatch, useSelector, useStore } from "react-redux";

import { createDirectRoom } from "../store/rooms";
import { selectAllUsersMedium } from "../store/users";
import AppCheckBox from "../app/components/AppCheckBox";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import AppButton from "../app/components/AppButton";
import colors from "../config/colors";
import { selectCurrentUserId } from "../store/currentUser";
import AppTitle from "../app/components/AppTitle";

function CreateDirectGroupScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const store = useStore();
  const currentUserId = selectCurrentUserId(store);
  const allUsers = useSelector(selectAllUsersMedium);

  const listKeyExtractor = (data) => data._id;

  const [selectedUsers, _setSelectedUsers] = useState([currentUserId]);

  const selectedUsersRef = React.useRef(selectedUsers);
  const setSelectedUsers = (data) => {
    selectedUsersRef.current = data;
    _setSelectedUsers(data);
  };

  const selectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsersRef.current.filter((u) => u !== userId));
    } else {
      setSelectedUsers([...selectedUsersRef.current, userId]);
    }
  };

  const onCreateRoom = () => {
    dispatch(createDirectRoom(currentUserId, selectedUsersRef.current));
    setModalVisible(false);
  };

  const listItem = ({ item }) => {
    if (item.status !== "active") return;
    const isCurrentUser = item._id === currentUserId ? true : false;
    return (
      <>
        <AppCheckBox
          label={`${item.firstName} ${item.lastName}`}
          onPressItem={item._id}
          onPress={(userId) => selectUser(userId)}
          disabled={isCurrentUser}
          initialValue={isCurrentUser}
        />

        <ListItemSeparator />
      </>
    );
  };

  return (
    <Screen style={styles.modal}>
      {/* <View style={styles.selectedUsers}>
        {Object.keys(allUsers).length !== 0 &&
          selectedUsers.map((item) => (
            <AppText key={item} style={styles.userName}>
              {allUsers
                ? `${allUsers[item].firstName} ${allUsers[item].lastName}`
                : ""}
            </AppText>
          ))}
      </View> */}
      <AppTitle>Select users</AppTitle>

      <View style={styles.usersList}>
        {allUsers && (
          <FlatList
            // ItemSeparatorComponent={() => <ListItemSeparator />}
            data={Object.values(allUsers)}
            bounces={false}
            keyExtractor={listKeyExtractor}
            renderItem={listItem}
          />
        )}
        <AppButton title="Submit" onPress={onCreateRoom} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { marginLeft: 20 },
  usersList: { padding: 20, marginBottom: 100 },
  selectedUsers: { margin: 20 },
  userName: { margin: 5, backgroundColor: colors.primary },
});

function areEqual(prevProps, nextProps) {
  return true;
}
export const MemoCreateDirectGroupScreen = React.memo(
  CreateDirectGroupScreen,
  areEqual
);
