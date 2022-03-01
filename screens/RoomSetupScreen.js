import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { navigationRef } from "../app/navigation/rootNavigation";
import { getAllUsers } from "../store/usersControl";
import { allUsers } from "../store/users";
import { getRoomMembersById } from "../store/rooms";

import {
  change_member,
  getMembersByRoomId,
  getRoomDataById,
  roomControlActivateRoom,
  roomControlArchiveRoom,
  roomControlDeleteRoom,
} from "../store/roomsControl";
import AppButton from "../app/components/AppButton";
import confirmAlert from "../utility/confirmAlert";
import AppCheckBox from "../app/components/AppCheckBox";
import { getCurrentUserId } from "../store/currentUser";

function RoomSetupScreen(item) {
  const roomId = item.route.params._id;
  const allUsersList = useSelector(allUsers());
  const roomMembers = useSelector(getRoomMembersById(roomId));
  const userId = useSelector(getCurrentUserId);
  const [selectedUsers, _setSelectedUsers] = useState(roomMembers);
  const listKeyExtractor = (data) => data._id;
  const selectedUsersRef = React.useRef(selectedUsers);

  const setSelectedUsers = (data) => {
    selectedUsersRef.current = data;
    _setSelectedUsers(data);
  };

  useEffect(() => {}, []);

  const onSaveChanges = () => {
    console.log(
      "muuta näisstä, tee oma muuotos, kun ei tarvi controlmuutosta",
      selectedUsersRef.current
    );
  };

  const selectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsersRef.current.filter((u) => u !== userId));
    } else {
      setSelectedUsers([...selectedUsersRef.current, userId]);
    }
  };
  const listItem = ({ item }) => {
    if (item._id === userId) return;
    return (
      <AppCheckBox
        initialValue={roomMembers.includes(item._id)}
        item={item}
        onPress={(userId) => selectUser(userId)}
      />
    );
  };
  return (
    <Screen>
      <View>
        {selectedUsers.map((item) => (
          <AppText key={item}>{item}</AppText>
        ))}
      </View>
      <AppButton title={"save changes"} onPress={onSaveChanges} />
      {allUsersList && (
        <FlatList
          ItemSeparatorComponent={() => <ListItemSeparator />}
          data={Object.values(allUsersList)}
          bounces={false}
          keyExtractor={listKeyExtractor}
          renderItem={listItem}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomSetupScreen;
