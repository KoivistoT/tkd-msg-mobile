import React, { useState } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
colors;

import { useDispatch, useSelector, useStore } from "react-redux";

import { createDirectRoom } from "../store/rooms";
import { selectAllUsersMedium, selectAllUsersMinimal } from "../store/users";
import AppCheckBox from "../app/components/AppCheckBox";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import AppText from "../app/components/AppText";
import AppButton from "../app/components/AppButton";
import colors from "../config/colors";

function CreateDirectGroupScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const store = useStore();
  const currentUserId = store.getState().auth.currentUser._id;
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
    if (item._id == currentUserId) return;
    if (item.status !== "active") return;

    return (
      <AppCheckBox
        label={`${item.firstName} ${item.lastName}`}
        onPressItem={item._id}
        onPress={(userId) => selectUser(userId)}
      />
    );
  };

  return (
    <Screen style={styles.modal}>
      <AppButton title="Create room" onPress={onCreateRoom} />
      <View>
        {Object.keys(allUsers).length !== 0 &&
          selectedUsers.map((item) => (
            <AppText key={item}>
              {allUsers
                ? `${allUsers[item].firstName} ${allUsers[item].lastName}`
                : ""}
            </AppText>
          ))}
      </View>
      <View style={styles.usersList}>
        {allUsers && (
          <FlatList
            ItemSeparatorComponent={() => <ListItemSeparator />}
            data={Object.values(allUsers)}
            bounces={false}
            keyExtractor={listKeyExtractor}
            renderItem={listItem}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { marginLeft: 20 },
  usersList: { margin: 20 },
});

function areEqual(prevProps, nextProps) {
  return true;
}
export const MemoCreateDirectGroupScreen = React.memo(
  CreateDirectGroupScreen,
  areEqual
);
