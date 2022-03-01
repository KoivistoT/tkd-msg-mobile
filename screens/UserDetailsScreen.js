import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppButton from "../app/components/AppButton";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { navigationRef } from "../app/navigation/rootNavigation";
import {
  archiveUserById,
  deleteUserById,
  activateUserById,
  userControlgetUserById,
} from "../store/usersControl";
import confirmAlert from "../utility/confirmAlert";

function UserDetailsScreen(item) {
  const dispatch = useDispatch();

  const userId = item.route.params._id;

  const userData = useSelector(userControlgetUserById(userId));

  const userItem = ({ item }) => <AppText style={styles.name}>{item}</AppText>;

  const deleteUser = async () => {
    const result = await confirmAlert("Haluatko poistaa käyttäjän?", "");
    if (!result) return;
    dispatch(deleteUserById(userId));
    navigationRef.current.goBack();
    console.log("ilmoitus, että käyttäjä poistettu");
  };

  const archiveUser = async () => {
    const result = await confirmAlert("Haluatko arkistoida käyttäjän?", "");
    if (!result) return;
    dispatch(archiveUserById(userId));
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
      <View style={{ flexDirection: "row" }}>
        <AppText>{userData.firstName} </AppText>
        <AppText>{userData.lastName}</AppText>
      </View>

      {userData.userRooms.length > 0 && (
        <FlatList
          ItemSeparatorComponent={() => <ListItemSeparator />}
          data={userData.userRooms}
          bounces={false}
          keyExtractor={(data) => data}
          renderItem={userItem}
        />
      )}
      {userData.userRooms.length === 0 && <AppText>User has no rooms</AppText>}

      {userData.archived ? (
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
        onPress={deleteUser}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default UserDetailsScreen;
