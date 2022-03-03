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
  archiveOrDeleteUserById,
  userControlGetAllChannels,
  allChannels,
} from "../store/usersControl";
import confirmAlert from "../utility/confirmAlert";

function UserDetailsScreen(item) {
  const dispatch = useDispatch();

  const userId = item.route.params._id;
  const allChannelsList = useSelector(allChannels());
  const userData = useSelector(userControlgetUserById(userId));

  const userItem = ({ item }) => {
    if (allChannelsList[item] === undefined) return;
    return (
      <AppText style={styles.name}>{allChannelsList[item].roomName}</AppText>
    );
  };

  useEffect(() => {
    dispatch(userControlGetAllChannels()); // hakee tämän varmuudeksi aina details sivulle mennessä
  }, []);

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
          <View style={{ flexDirection: "row" }}>
            <AppText>{userData.firstName} </AppText>
            <AppText>{userData.lastName}</AppText>
          </View>
          <AppText>User channels:</AppText>
          {userData.userRooms.length > 0 && (
            <FlatList
              ItemSeparatorComponent={() => <ListItemSeparator />}
              data={userData.userRooms}
              bounces={false}
              keyExtractor={(data) => data}
              renderItem={userItem}
            />
          )}

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
