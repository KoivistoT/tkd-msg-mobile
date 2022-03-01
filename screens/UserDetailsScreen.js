import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useDispatch } from "react-redux";
import AppButton from "../app/components/AppButton";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { navigationRef } from "../app/navigation/rootNavigation";
import {
  archiveUserById,
  deleteUserById,
  activateUserById,
  userControlUserDeleted,
} from "../store/usersControl";
import confirmAlert from "../utility/confirmAlert";

function UserDetailsScreen(item) {
  const { params: userData } = item.route;
  const userId = item.route.params._id;
  const dispatch = useDispatch();

  const userItem = ({ item }) => <AppText style={styles.name}>{item}</AppText>;
  const deleteUser = async () => {
    const result = await confirmAlert("title", "text");

    if (!result) return;

    dispatch(deleteUserById(userId));

    navigationRef.current.goBack();
    console.log("ilmoitus, että käyttäjä poistettu");
  };

  const archiveUser = () => {
    dispatch(archiveUserById(userId));
  };
  const activateUser = () => {
    dispatch(activateUserById(userId));
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
      <AppButton title={"delete user"} onPress={deleteUser} />
      <AppButton title={"archive user"} onPress={archiveUser} />
      <AppButton title={"activate user"} onPress={activateUser} />
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default UserDetailsScreen;
