import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppButton from "../app/components/AppButton";
import UserInfoCard from "../app/components/UserInfoCard";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import EditUserModal from "../app/components/modals/EditUserModal";
import Screen from "../app/components/Screen";
import { navigationRef } from "../app/navigation/rootNavigation";
import {
  selectUserById,
  activateUserById,
  archiveOrDeleteUserById,
} from "../store/users";

import confirmAlert from "../utility/confirmAlert";

function UserDetailsScreen(item) {
  const dispatch = useDispatch();

  const userId = item.route.params._id;

  const userData = useSelector(selectUserById(userId));

  const onDeleteUser = async () => {
    const result = await confirmAlert("Haluatko poistaa käyttäjän", "");
    if (!result) return;
    dispatch(archiveOrDeleteUserById(userId, "deleted"));
    navigationRef.current.goBack();
    console.log("ilmoitus, että käyttäjä poistettu");
  };

  const archiveUser = async () => {
    const result = await confirmAlert("Haluatko arkistoida käyttäjän?", "");
    if (!result) return;
    dispatch(archiveOrDeleteUserById(userId, "archived"));
    console.log("ilmoitus, että käyttäjä arkistoitu");
  };

  const activateUser = async () => {
    const result = await confirmAlert("Haluatko aktivoida käyttäjän?", "");
    if (!result) return;
    dispatch(activateUserById(userId));
    console.log("ilmoitus, että käyttäjä aktivoitu");
  };

  return (
    <Screen>
      {userData && (
        <View>
          <UserInfoCard userId={userId} />
          {/* <View style={{ flexDirection: "row" }}>
            <AppText>{userData.firstName} </AppText>
            <AppText>{userData.lastName}</AppText>
          </View> */}
          {/* <AppText>User channels:</AppText>
          {userData.userRooms.length > 0 && (
            <FlatList
              ItemSeparatorComponent={() => <ListItemSeparator />}
              data={userData.userRooms}
              bounces={false}
              keyExtractor={(data) => data}
              renderItem={userItem}
            />
          )} */}

          <EditUserModal userId={userData._id} />
          {userData.status === "archived" ? (
            <AppButton
              title={"activate user"}
              color="white"
              backgroundColor="green"
              onPress={activateUser}
            />
          ) : (
            <AppButton
              title={"archive user"}
              color="black"
              backgroundColor="yellow"
              onPress={archiveUser}
            />
          )}
          <AppButton
            title={"delete user"}
            color="white"
            backgroundColor="danger"
            onPress={onDeleteUser}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default UserDetailsScreen;
