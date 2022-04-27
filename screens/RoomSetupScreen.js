import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { navigate } from "../app/navigation/rootNavigation";
import {
  allUsers,
  selectAllUsers,
  selectAllUsersMedium,
  selectAllUsersMinimal,
} from "../store/users";
import {
  activateRoom,
  change_members,
  deleteRoom,
  selectRoomDataById,
  leave_room,
  selectRoomMembersById,
  roomRemoved,
  roomTasksResived,
  changeRoomDescription,
} from "../store/rooms";
import AppButton from "../app/components/AppButton";
import confirmAlert from "../utility/confirmAlert";
import AppCheckBox from "../app/components/AppCheckBox";
import { selectCurrentUserData } from "../store/currentUser";
import routes from "../app/navigation/routes";
import { ScrollView } from "react-native-gesture-handler";

import ChangeRoomNameModal from "../app/components/modals/ChangeRoomNameModal";
import roomFuncs from "../utility/roomFuncs";
import colors from "../config/colors";
import SectionSeparator from "../app/components/SectionSeparator";
import AppTitle from "../app/components/AppTitle";
import UserInfoCard from "../app/components/UserInfoCard";
import userFuncs from "../utility/userFuncs";
import sortArray from "../utility/sortArray";
import AppButtonWithLoader from "../app/components/messageItems/AppButtonWithLoader";
import { messagesRemoved } from "../store/msgStore";
import createTask from "../utility/createTask";
import AppTextInput from "../app/components/AppTextInput";

function RoomSetupScreen(item) {
  const dispatch = useDispatch();
  const scrollView = useRef();

  const {
    _id: roomId,
    status: roomStatus,
    roomCreator,
    description,
    type: roomType,

    members,
  } = item.route.params;

  const allUsers = useSelector(selectAllUsersMedium);
  const roomMembers = useSelector(selectRoomMembersById(roomId));
  const requestId = Date.now();
  const currentUserData = useSelector(selectCurrentUserData);
  const roomData = useSelector(selectRoomDataById(roomId));

  const [selectedUsers, _setSelectedUsers] = useState(roomMembers);
  const selectedUsersRef = React.useRef(selectedUsers);
  let roomMembersOnStart = useRef(members);

  useEffect(() => {}, [roomData]);

  const setSelectedUsers = (data) => {
    selectedUsersRef.current = data;
    _setSelectedUsers(data);
  };

  const listKeyExtractor = (data) => data._id;

  const checkIsMembersChanged = () => {
    const a = roomMembersOnStart.current;
    const b = selectedUsers;
    return (
      a.length === b.length &&
      sortArray([...a]).every((val, index) => val === sortArray([...b])[index])
    );
  };

  const onLeaveRoom = async () => {
    let result;
    const activeMembers = roomFuncs.getRoomActiveMembersSum(
      roomMembers,
      allUsers
    );

    if (activeMembers === 1) {
      result = await confirmAlert(
        "Olet huoneen viimeinen käyttjä. Haluatko poistua huoneesta?",
        "Poistuttuasi, huone ja huoneen viestit poistetaan pysyvästi."
      );
    } else {
      result = await confirmAlert("Haluatko poistua huoneesta?", "");
    }

    if (!result) return;

    dispatch(leave_room(roomId, currentUserData._id, "leaveRoom"));
    removeRoomAndNavigate(roomId);
  };

  const removeRoomAndNavigate = (roomId) => {
    dispatch(roomRemoved(roomId));
    dispatch(messagesRemoved(roomId));
    navigate(routes.ROOM_SCREEN);
  };

  const onActivateRoom = async () => {
    const result = await confirmAlert("Haluatko aktivoida huoneen?", "");
    if (!result) return;

    dispatch(activateRoom(roomId, currentUserData._id));
    goBack();
  };

  const onDeleteRoom = async () => {
    const result = await confirmAlert("Haluatko poistaa huoneen?", "");
    if (!result) return;

    dispatch(deleteRoom(roomId, currentUserData._id, "deleteRoomSetup"));
    removeRoomAndNavigate(roomId);
  };

  const onSaveChanges = () => {
    roomMembersOnStart.current = selectedUsers;
    const newMemebers = selectedUsersRef.current;
    const newTask = createTask("membersChanged", {
      _id: roomId,
      members: newMemebers,
    });
    dispatch(roomTasksResived(newTask));

    dispatch(change_members(roomId, newMemebers, currentUserData._id));
  };

  const selectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsersRef.current.filter((u) => u !== userId));
    } else {
      setSelectedUsers([...selectedUsersRef.current, userId]);
    }
  };

  const listItem = ({ item }) => {
    if (item.status !== "active") return;

    return (
      <AppCheckBox
        label={`${item.firstName} ${item.lastName}`}
        initialValue={roomMembers ? roomMembers.includes(item._id) : false}
        item={item}
        disabled={item._id === currentUserData._id}
        onPressItem={item._id}
        onPress={(userId) => selectUser(userId)}
      />
    );
  };
  const listItem2 = ({ item }) => {
    if (allUsers[item].status === "deleted") return;
    if (allUsers[item].status === "archived") return;
    return (
      <AppText
        style={{ height: 22 }}
        key={item._id}
      >{`${allUsers[item].firstName} ${allUsers[item].lastName}`}</AppText>
    );
  };
  const [editDescription, setEditDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState(roomData?.description);
  const onEditDescription = () => {
    setEditDescription(true);
  };
  const onSaveDescription = () => {
    setEditDescription(false);
    const payload = {
      roomId,
      description: descriptionText,
    };
    const newTask = createTask("roomDescriptionChanged", payload);

    dispatch(roomTasksResived(newTask));

    dispatch(
      changeRoomDescription(roomId, descriptionText, currentUserData._id)
    );
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <View
        style={{
          alignSelf: "center",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        {roomData?.type !== "private" && (
          <View style={{ alignItems: "center" }}>
            <AppText>Chat name</AppText>
            {roomType !== "channel" && (
              <AppText numberOfLines={1} style={{ fontSize: 20 }}>
                {roomFuncs.getRoomTitle(
                  roomData,
                  allUsers,
                  currentUserData._id
                )}
              </AppText>
            )}
            {roomType === "channel" && (
              <ChangeRoomNameModal
                title={roomFuncs.getRoomTitle(
                  roomData,
                  allUsers,
                  currentUserData._id
                )}
                roomId={roomId}
                roomNameNow={roomData?.roomName}
              />
            )}
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          marginBottom: 20,
        }}
      >
        <AppText>{`Chat type: ${roomType}`}</AppText>
        <AppText
          style={{
            color: roomStatus === "active" ? colors.success : colors.lightgrey,
            marginLeft: 5,
          }}
        >{`(${roomStatus})`}</AppText>
      </View>

      {roomType === "private" && (
        <UserInfoCard
          hideFields={["accountType"]}
          userId={roomFuncs.getPrivateRoomOtherUserId(
            roomMembers,
            currentUserData._id
          )}
        />
      )}
      {roomData?.description !== undefined && (
        <View>
          <AppText style={{ marginBottom: 5, alignSelf: "center" }}>
            Description
          </AppText>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => onEditDescription()}
          >
            <View
              style={{
                backgroundColor: colors.background1,
                borderRadius: 7,
                padding: 10,
              }}
            >
              {!editDescription && (
                <AppText style={{ padding: 12, paddingLeft: 10 }}>
                  {roomData?.description
                    ? roomData?.description
                    : "Add description"}
                </AppText>
              )}
              {editDescription && (
                <View>
                  <AppTextInput
                    style={{ fontSize: 16, marginBottom: 20 }}
                    onChangeText={(text) => setDescriptionText(text)}
                    multiline
                    defaultValue={roomData?.description}
                  />

                  <AppButton
                    onPress={() => onSaveDescription()}
                    title="SAVE"
                    fontSize={16}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {roomType !== "private" && (
        <>
          <SectionSeparator />
          <AppText style={{ alignSelf: "center" }}>Chat members</AppText>
        </>
      )}

      {/* <View
        style={{
          marginVertical: 10,
          backgroundColor: colors.background1,
          borderRadius: 7,
          height: 150,
          margin: 10,
          overflow: "hidden",
          paddingLeft: 10,
          paddingVertical: 10,
        }}
        ref={scrollView}
        onContentSizeChange={() => scrollView.current.scrollToEnd()}
      >
        <FlatList
          ItemSeparatorComponent={() => <ListItemSeparator />}
          data={selectedUsers}
          bounces={false}
          keyExtractor={(item) => item}
          renderItem={listItem2}
        />
      </View> */}

      {roomType !== "private" && roomStatus !== "archived" && allUsers && (
        <View
          style={{
            marginVertical: 10,
            backgroundColor: colors.light,
            borderRadius: 7,

            margin: 10,
            overflow: "hidden",
            paddingLeft: 10,
            paddingVertical: 10,
          }}
          ref={scrollView}
          onContentSizeChange={() => scrollView.current.scrollToEnd()}
        >
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
          {/* <FlatList
            ItemSeparatorComponent={() => <ListItemSeparator />}
            data={Object.values(allUsers)}
            bounces={false}
            keyExtractor={listKeyExtractor}
            renderItem={listItem}
          /> */}
        </View>
      )}
      {roomType !== "private" &&
        roomStatus !== "archived" &&
        !checkIsMembersChanged() && (
          <AppButton
            backgroundColor="success"
            buttonWidth={"100%"}
            title={"Save changes"}
            onPress={onSaveChanges}
          />
        )}
      <SectionSeparator />
      <View
        style={{
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        <View>
          {roomType !== "private" && (
            <AppButton
              title={`Leave chat`}
              onPress={onLeaveRoom}
              backgroundColor={"primary"}
            />
          )}
        </View>

        {(currentUserData.accountType === "admin" ||
          currentUserData._id === roomCreator ||
          roomType === "private") && (
          <AppButton
            title={`Delete chat`}
            onPress={onDeleteRoom}
            backgroundColor={"danger"}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
export default RoomSetupScreen;
