import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { navigationRef } from "../app/navigation/rootNavigation";
import { getAllUsers } from "../store/usersControl";
import {
  change_member,
  getMembersByRoomId,
  getRoomDataById,
  getRoomMembersById,
  roomControlActivateRoom,
  roomControlArchiveRoom,
  roomControlDeleteRoom,
} from "../store/roomsControl";
import AppButton from "../app/components/AppButton";
import confirmAlert from "../utility/confirmAlert";

function RoomDetailsScreen(item) {
  const roomId = item.route.params._id;
  const roomData = useSelector(getRoomDataById(roomId));
  const { users } = useSelector((state) => state.entities.usersControl);
  const members = useSelector(getRoomMembersById(roomId));
  // console.log(users, "käyttäjät");
  // console.log(members, "memberit");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getMembersByRoomId(roomId));
  }, []);

  const onDeleteRoom = async () => {
    const result = await confirmAlert("Haluatko poistaa huoneen?", "");
    if (!result) return;

    navigationRef.current.goBack();
    setTimeout(() => {
      dispatch(roomControlDeleteRoom(roomId));
    }, 1000);
  };

  const onArchiveRoom = async () => {
    const result = await confirmAlert("Haluatko arkistoida huoneen?", "");
    if (!result) return;

    dispatch(roomControlArchiveRoom(roomId));
  };

  const onActivateRoom = async () => {
    const result = await confirmAlert("Haluatko aktivoida huoneen?", "");
    if (!result) return;
    dispatch(roomControlActivateRoom(roomId));
  };

  const change_membership = (item, membership) => {
    if (membership) {
      dispatch(change_member(roomId, item._id, membership));
    } else {
      dispatch(change_member(roomId, item, membership));
    }
  };

  // console.log(
  //   "ensin hakee membersit ja sit myös kaikki userit, kun userin lisää huoneeseen, sen id menee memberseihin"
  // );
  // console.log(
  //   "tarvitsee actionin ja sen, että katsoo kuuluuko huoneeseen, eli pitääkin hakea huoneen membersit myös ja sitten ne yhdistää. sen voi tehdä BE:ssä "
  // );
  // console.log("listitemit voisi olla jossain reusable");
  const usersListItem = ({ item }) => {
    if (!members.includes(item._id)) {
      return (
        <View>
          <AppText style={{ paddingLeft: 10, marginTop: 4 }}>
            {item.displayName}
          </AppText>
          <AppButton
            onPress={() => change_membership(item, true)}
            title="Add to room"
          />
        </View>
      );
    }
  };
  const membersListItem = ({ item }) => (
    <View>
      <AppText style={{ paddingLeft: 10, marginTop: 4 }}>
        {users[item]?.displayName}
      </AppText>
      <AppButton
        onPress={() => change_membership(item, false)}
        title="Remove from room"
      />
    </View>
  );

  return (
    <Screen>
      <View style={{ flexDirection: "row" }}>
        <AppText>{roomData.roomName} </AppText>
      </View>
      <AppButton
        title="delete room"
        backgroundColor="danger"
        onPress={onDeleteRoom}
      />
      {roomData.status === "archived" ? (
        <AppButton
          title="activate room"
          backgroundColor="green"
          color="black"
          onPress={onActivateRoom}
        />
      ) : (
        <AppButton
          title="archive room"
          backgroundColor="yellow"
          color="black"
          onPress={onArchiveRoom}
        />
      )}

      <AppText>Room members</AppText>
      <FlatList
        ItemSeparatorComponent={() => <ListItemSeparator />}
        data={members}
        bounces={false}
        keyExtractor={(data) => data}
        renderItem={membersListItem}
      />
      <AppText>All users</AppText>
      {users && (
        <FlatList
          ItemSeparatorComponent={() => <ListItemSeparator />}
          data={Object.values(users)}
          bounces={false}
          keyExtractor={(data) => data._id}
          renderItem={usersListItem}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default RoomDetailsScreen;
