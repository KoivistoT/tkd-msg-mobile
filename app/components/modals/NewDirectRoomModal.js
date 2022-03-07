import React, { useState } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppButton from "../AppButton";
import AppText from "../AppText";
import Screen from "../Screen";
import { useDispatch, useSelector, useStore } from "react-redux";
import { allUsers, selectAllUsers } from "../../../store/users";
import ListItemSeparator from "../ListItemSeparator";
import AppCheckBox from "../AppCheckBox";
import { createDirectRoom } from "../../../store/rooms";

function NewDirectRoomModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const store = useStore();
  const currentUserId = store.getState().auth.currentUser._id;
  const allUsers = useSelector(selectAllUsers);

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
    if (item.status === "deleted") return;
    if (item.status === "archived") return;
    return (
      <AppCheckBox
        label={`${item.firstName} ${item.lastName}`}
        onPressItem={item._id}
        onPress={(userId) => selectUser(userId)}
      />
    );
  };

  return (
    <>
      <Modal visible={modalVisible} animationType="none">
        <Screen style={styles.modal}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              setSelectedUsers([currentUserId]);
            }}
            style={{ position: "relative", alignSelf: "flex-end", padding: 20 }}
          >
            <MaterialCommunityIcons
              name="close"
              size={25}
              color={colors.dark}
            />
          </TouchableOpacity>
          <AppButton title="Create room" onPress={onCreateRoom} />
          <View>
            {allUsers &&
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
      </Modal>
      <View style={{ margin: 20, width: "50%", alignSelf: "center" }}>
        <AppButton
          onPress={() => setModalVisible(true)}
          title={"New direct room"}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  name: { marginLeft: 20 },
  usersList: { margin: 20 },
});

function areEqual(prevProps, nextProps) {
  return true;
}
export const MemoNewDirectRoomModal = React.memo(NewDirectRoomModal, areEqual);
// export default NewDirectRoomModal;
