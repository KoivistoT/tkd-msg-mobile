import React, { useState, useRef } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { navigationRef } from "../app/navigation/rootNavigation";
import { allUsers } from "../store/users";
import {
  activateRoom,
  archiveRoomById,
  change_members,
  deleteRoom,
  getRoomMembersById,
  leave_room,
  setRoomLoadingToFalse,
  setRoomLoadingToTrue,
} from "../store/rooms";
import AppButton from "../app/components/AppButton";
import confirmAlert from "../utility/confirmAlert";
import AppCheckBox from "../app/components/AppCheckBox";
import { getCurrentUserData } from "../store/currentUser";
import routes from "../app/navigation/routes";
import { ScrollView } from "react-native-gesture-handler";
import getRoomActiveMembersSum from "../utility/getRoomActiveMembersSum";

function RoomSetupScreen(item) {
  const dispatch = useDispatch();
  const scrollView = useRef();

  const {
    _id: roomId,
    status: roomStatus,
    roomCreator,
    description,
    type: roomType,
  } = item.route.params;

  const allUsersList = useSelector(allUsers());
  const roomMembers = useSelector(getRoomMembersById(roomId));
  const currentUserData = useSelector(getCurrentUserData);

  const [selectedUsers, _setSelectedUsers] = useState(roomMembers);
  const selectedUsersRef = React.useRef(selectedUsers);

  const setSelectedUsers = (data) => {
    selectedUsersRef.current = data;
    _setSelectedUsers(data);
  };

  const listKeyExtractor = (data) => data._id;

  const onLeaveRoom = async () => {
    let result;
    const activeMembers = getRoomActiveMembersSum(roomMembers, allUsersList);
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
    dispatch(setRoomLoadingToTrue());
    setTimeout(() => {
      dispatch(deleteRoom(roomId));
      dispatch(setRoomLoadingToFalse());
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

    dispatch(archiveRoomById(roomId));
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
    if (item.status === "deleted") return;
    if (item.status === "archived") return;
    return (
      <AppCheckBox
        label={`${item.firstName} ${item.lastName}`}
        initialValue={roomMembers.includes(item._id)}
        item={item}
        onPressItem={item._id}
        onPress={(userId) => selectUser(userId)}
      />
    );
  };

  return (
    <Screen>
      <AppText>{`Huoneen tyyppi on: ${roomType}`}</AppText>
      {description !== undefined && (
        <AppText>{`Huoneen kuvaus on: ${description}`}</AppText>
      )}
      <AppText>{`Huoneen status on: ${roomStatus}`}</AppText>
      <AppText>Members</AppText>

      <ScrollView
        style={{ maxHeight: 100 }}
        ref={scrollView}
        onContentSizeChange={() => scrollView.current.scrollToEnd()}
      >
        {selectedUsers.map((item) => {
          if (allUsersList[item].status === "deleted") return;
          if (allUsersList[item].status === "archived") return;
          return (
            <AppText
              key={item}
            >{`${allUsersList[item].firstName} ${allUsersList[item].lastName}`}</AppText>
          );
        })}
      </ScrollView>
      {roomType !== "private" && roomStatus !== "archived" && (
        <AppButton title={"save changes"} onPress={onSaveChanges} />
      )}

      {roomType !== "private" && roomStatus !== "archived" && allUsersList && (
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
          {roomType !== "private" && (
            <AppButton
              title={`Leave ${roomType}`}
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
      {(currentUserData.accountType === "admin" ||
        currentUserData._id === roomCreator ||
        roomType === "private") && (
        <AppButton
          title={`Delete ${roomType}`}
          onPress={onDeleteRoom}
          backgroundColor={"danger"}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomSetupScreen;
