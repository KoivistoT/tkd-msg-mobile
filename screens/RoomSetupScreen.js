import React, { useState, useRef } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { navigationRef } from "../app/navigation/rootNavigation";
import {
  allUsers,
  selectAllUsers,
  selectAllUsersMedium,
  selectAllUsersMinimal,
} from "../store/users";
import {
  activateRoom,
  archiveRoomById,
  changeRoomName,
  change_members,
  deleteRoom,
  selectRoomDataById,
  leave_room,
  setRoomLoadingToFalse,
  setRoomLoadingToTrue,
  selectRoomMembersById,
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

function RoomSetupScreen(item) {
  const dispatch = useDispatch();
  const scrollView = useRef();

  const {
    _id: roomId,
    status: roomStatus,
    roomCreator,
    description,
    type: roomType,
    roomName,
  } = item.route.params;

  const allUsers = useSelector(selectAllUsersMedium);
  const roomMembers = useSelector(selectRoomMembersById(roomId));

  const currentUserData = useSelector(selectCurrentUserData);

  const [selectedUsers, _setSelectedUsers] = useState(roomMembers);
  const selectedUsersRef = React.useRef(selectedUsers);

  const setSelectedUsers = (data) => {
    selectedUsersRef.current = data;
    _setSelectedUsers(data);
  };

  const listKeyExtractor = (data) => data._id;

  const onLeaveRoom = async () => {
    let result;
    const activeMembers = roomFuncs.getRoomActiveMembersSum(
      roomMembers,
      allUsers
    );
    if (activeMembers) {
      result = await confirmAlert(
        "Olet huoneen viimeinen käyttjä. Haluatko poistua huoneesta?",
        "Poistuttuasi, huone ja huoneen viestit poistetaan pysyvästi."
      );
    } else {
      result = await confirmAlert("Haluatko poistua huoneesta?", "");
    }

    if (!result) return;

    navigationRef.current.navigate(routes.ROOM_SCREEN);
    setTimeout(() => {
      dispatch(leave_room(roomId, currentUserData._id));
    }, 800);
  };

  const onActivateRoom = async () => {
    const result = await confirmAlert("Haluatko aktivoida huoneen?", "");
    if (!result) return;

    dispatch(activateRoom(roomId, currentUserData._id));
    navigationRef.current.goBack();
  };

  const onDeleteRoom = async () => {
    const result = await confirmAlert("Haluatko poistaa huoneen?", "");
    if (!result) return;

    navigationRef.current.navigate(routes.ROOM_SCREEN);
    dispatch(deleteRoom(roomId));

    // setTimeout(() => {
    //    dispatch(setRoomLoadingToFalse());
    // }, 300); // tämä ei pakillinen, toimii vain hienommin
  };
  const onArchiveRoom = async () => {
    const result = await confirmAlert(
      "Haluatko arkistoida huoneen?",
      "Tämä poistaa huoneen muilta käyttäjiltä. Toiminnon voi perua aktivoimalla huoneen uudelleen"
    );
    if (!result) return;

    navigationRef.current.navigate(routes.ROOM_SCREEN);
    console.log("ilmoita, että arhived");

    dispatch(archiveRoomById(roomId));
  };

  const onSaveChanges = () => {
    dispatch(change_members(roomId, selectedUsersRef.current));
  };

  const selectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsersRef.current.filter((u) => u !== userId));
    } else {
      setSelectedUsers([...selectedUsersRef.current, userId]);
    }
  };

  const listItem = ({ item }) => {
    if (item.status === "deleted") return;
    if (item.status === "archived") return;
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

  return (
    <ScrollView style={{ padding: 20 }}>
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
            color: roomStatus === "active" ? colors.success : colors.yellow,
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
      {description !== undefined && (
        <View>
          <AppText style={{ marginBottom: 5, alignSelf: "center" }}>
            Description
          </AppText>
          <View
            style={{
              backgroundColor: colors.background1,
              borderRadius: 7,
              padding: 10,
            }}
          >
            <AppText style={{ alignSelf: "center" }}>{description}</AppText>
          </View>
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
            if (item.status === "deleted") return;
            if (item.status === "archived") return;
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
      {roomType !== "private" && roomStatus !== "archived" && (
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
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        {(currentUserData._id === roomCreator ||
          currentUserData.accountType === "admin") && (
          <View>
            {roomType !== "private" && (
              <AppButton
                // title={`Leave ${roomType}`}
                title={`Leave chat`}
                onPress={onLeaveRoom}
                backgroundColor={"primary"}
              />
            )}
            {/* {roomStatus === "archived" ? (
            <AppButton
              title={`Activate ${roomType}`}
              onPress={onActivateRoom}
              backgroundColor={"green"}
            />
          ) : (
            <AppButton
              title={`Archive ${roomType}`}
              onPress={onArchiveRoom}
              color={"black"}
              backgroundColor={"yellow"}
            />
          )} */}
          </View>
        )}

        {roomType === "channel" && (
          <ChangeRoomNameModal roomId={roomId} roomNameNow={roomName} />
        )}

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
