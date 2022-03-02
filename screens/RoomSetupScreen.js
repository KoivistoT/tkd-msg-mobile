import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { navigationRef } from "../app/navigation/rootNavigation";
import { getAllUsers } from "../store/usersControl";
import { allUsers } from "../store/users";
import {
  archiveRoomById,
  change_members,
  deleteRoom,
  getRoomMembersById,
} from "../store/rooms";

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
import { getCurrentUserData, getCurrentUserId } from "../store/currentUser";
import routes from "../app/navigation/routes";

function RoomSetupScreen(item) {
  const roomId = item.route.params._id;
  const roomCreator = item.route.params.roomCreator;
  const allUsersList = useSelector(allUsers());
  const roomMembers = useSelector(getRoomMembersById(roomId));
  const currentUserData = useSelector(getCurrentUserData);
  const [selectedUsers, _setSelectedUsers] = useState(roomMembers);
  const listKeyExtractor = (data) => data._id;
  const selectedUsersRef = React.useRef(selectedUsers);
  const dispatch = useDispatch();

  const setSelectedUsers = (data) => {
    selectedUsersRef.current = data;
    _setSelectedUsers(data);
  };

  useEffect(() => {}, []);

  const onActivateRoom = async () => {
    const result = await confirmAlert("Haluatko aktivoida huoneen?", "");
    if (!result) return;

    // dispatch(deleteRoom(roomId));
    navigationRef.current.navigate(routes.ROOM_SCREEN);
    // navigationRef.current.goBack();
  };

  const onDeleteRoom = async () => {
    const result = await confirmAlert("Haluatko poistaa huoneen?", "");
    if (!result) return;

    navigationRef.current.navigate(routes.ROOM_SCREEN);
    // navigationRef.current.goBack();
    setTimeout(() => {
      dispatch(deleteRoom(roomId));
    }, 800);
  };
  const onArchiveRoom = async () => {
    const result = await confirmAlert(
      "Haluatko arkistoida huoneen?",
      "Tämä poistaa huoneen muilta käyttäjiltä. Toiminnon voi perua aktivoimalla huoneen uudelleen"
    );
    if (!result) return;

    navigationRef.current.navigate(routes.ROOM_SCREEN);
    console.log("ilmoita, että arhived");

    dispatch(archiveRoomById(roomId, currentUserData._id));
  };

  const onSaveChanges = () => {
    const members = selectedUsersRef.current;
    dispatch(change_members(roomId, members));
  };

  const selectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsersRef.current.filter((u) => u !== userId));
    } else {
      setSelectedUsers([...selectedUsersRef.current, userId]);
    }
  };
  const listItem = ({ item }) => {
    if (item._id === currentUserData._id) return;
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

      {(currentUserData._id === roomCreator ||
        currentUserData.accountType === "admin") && (
        <View>
          <AppButton
            title={"activate room"}
            onPress={onActivateRoom}
            backgroundColor={"green"}
          />
          <AppButton
            title={"Archive room"}
            onPress={onArchiveRoom}
            color={"black"}
            backgroundColor={"yellow"}
          />
          <AppButton
            title={"Delete room"}
            onPress={onDeleteRoom}
            backgroundColor={"danger"}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomSetupScreen;
