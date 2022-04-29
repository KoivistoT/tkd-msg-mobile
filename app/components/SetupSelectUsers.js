import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../../config/colors";
import { changeMembers, roomTasksResived } from "../../store/rooms";
import AppButton from "./AppButton";
import AppCheckBox from "./AppCheckBox";
import ListItemSeparator from "./ListItemSeparator";

function SetupSelectUsers({
  allUsers,
  roomMembers,
  currentUserData,
  members,
  roomId,
}) {
  const dispatch = useDispatch();
  let roomMembersOnStart = useRef(members);
  const [selectedUsers, _setSelectedUsers] = useState(roomMembers);
  const selectedUsersRef = React.useRef(selectedUsers);

  const onSaveChanges = () => {
    roomMembersOnStart.current = selectedUsers;
    const newMemebers = selectedUsersRef.current;
    const newTask = createTask("membersChanged", {
      _id: roomId,
      members: newMemebers,
    });
    dispatch(roomTasksResived(newTask));
    dispatch(changeMembers(roomId, newMemebers, currentUserData._id));
  };

  const checkIsMembersChanged = () => {
    const a = roomMembersOnStart.current;
    const b = selectedUsers;
    return (
      a.length === b.length &&
      sortArray([...a]).every((val, index) => val === sortArray([...b])[index])
    );
  };

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

  return (
    <View style={styles.container}>
      {Object.values(allUsers).map((item) => {
        if (item.status !== "active") return;

        return (
          <View key={item._id}>
            <AppCheckBox
              label={`${item.firstName} ${item.lastName}`}
              initialValue={
                roomMembers ? roomMembers.includes(item._id) : false
              }
              item={item}
              disabled={item._id === currentUserData._id}
              onPressItem={item._id}
              onPress={(userId) => selectUser(userId)}
            />
            <ListItemSeparator />
          </View>
        );
      })}
      {!checkIsMembersChanged() && (
        <AppButton
          backgroundColor="success"
          buttonWidth={"100%"}
          title={"Save changes"}
          onPress={onSaveChanges}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: colors.light,
    borderRadius: 7,
    margin: 10,
    overflow: "hidden",
    paddingLeft: 10,
    paddingVertical: 10,
  },
});

export default SetupSelectUsers;
