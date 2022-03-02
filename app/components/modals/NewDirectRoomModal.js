import React, { useState, useRef, useEffect } from "react";

import Platform from "react-native";
import {
  Alert,
  StyleSheet,
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  FlatList,
  Button,
  View,
  ScrollView,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../config/colors";

import AppButton from "../AppButton";

import AppText from "../AppText";
import Screen from "../Screen";
import CreateUserForm from "../forms/CreateUserForm";
import CreateChannelForm from "../forms/CreateChannelForm";
import { useDispatch, useSelector, useStore } from "react-redux";

import { allUsers } from "../../../store/users";
import ListItemSeparator from "../ListItemSeparator";
import AppCheckBox from "../AppCheckBox";
import { createDirectRoom } from "../../../store/rooms";
import { navigationRef } from "../../navigation/rootNavigation";

function NewDirectRoomModal({}) {
  const [modalVisible, setModalVisible] = useState(false);

  //huom ei react-native-modal
  const dispatch = useDispatch();
  const store = useStore();
  const userId = store.getState().auth.currentUser._id;
  const allUsersList = useSelector(allUsers());
  const listKeyExtractor = (data) => data._id;

  const [selectedUsers, _setSelectedUsers] = useState([]);

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
    // console.log("create room with users", selectedUsersRef.current);
    dispatch(createDirectRoom(userId, selectedUsersRef.current));
    setModalVisible(false);
  };

  const listItem = ({ item }) => (
    <AppCheckBox item={item} onPress={(userId) => selectUser(userId)} />
  );

  return (
    <View>
      <Modal visible={modalVisible} animationType="slide" style={styles.modal}>
        <Screen>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              setSelectedUsers([]);
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
            {selectedUsers.map((item) => (
              <AppText key={item}>{item}</AppText>
            ))}
          </View>
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
      </Modal>
      <View style={{ margin: 20, width: "50%", alignSelf: "center" }}>
        <AppButton
          onPress={() => setModalVisible(true)}
          title={"New direct room"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.white,
    // marginHorizontal: 30,
    // marginVertical: 100,

    // marginTop: Constants.statusBarHeight,
    borderRadius: 5,
    // paddingTop: Constants.statusBarHeight,
  },
  name: { marginLeft: 20 },
  button: {},
});
export default NewDirectRoomModal;
