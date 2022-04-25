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
import ChangePasswordModal from "../app/components/modals/ChangePasswordModal";
import AppButtonWithLoader from "../app/components/messageItems/AppButtonWithLoader";

function UserDetailsScreen(item) {
  const dispatch = useDispatch();

  const userId = item.route.params._id;
  const requestId = Date.now();
  const userData = useSelector(selectUserById(userId));

  const onDeleteUser = async () => {
    const result = await confirmAlert("Haluatko poistaa käyttäjän", "");
    if (!result) return;
    dispatch(archiveOrDeleteUserById(userId, "deleted", requestId));
    navigationRef.current.goBack();
    console.log("ilmoitus, että käyttäjä poistettu");
  };

  const archiveUser = async () => {
    const result = await confirmAlert("Haluatko arkistoida käyttäjän?", "");
    if (!result) return;
    dispatch(archiveOrDeleteUserById(userId, "archived", "archiveUser"));
    console.log("ilmoitus, että käyttäjä arkistoitu");
  };

  const activateUser = async () => {
    const result = await confirmAlert("Haluatko aktivoida käyttäjän?", "");
    if (!result) return;
    dispatch(activateUserById(userId, "activateUser"));
    console.log("ilmoitus, että käyttäjä aktivoitu");
  };

  return (
    <View style={styles.container}>
      {userData && (
        <View style={{ padding: 20 }}>
          <UserInfoCard userId={userId} />

          <View style={styles.buttonRow}>
            <EditUserModal userId={userData._id} />
            {userData.status === "archived" ? (
              // <AppButton
              //   title={"activate user"}
              //   color="white"
              //   backgroundColor="green"
              //   onPress={activateUser}
              // />
              <AppButtonWithLoader
                successMessage={"Activated"}
                requestId={"activateUser"}
                onPress={activateUser}
                title={"activate user"}
                backgroundColor="green"
              />
            ) : (
              <AppButtonWithLoader
                successMessage={"Archived"}
                requestId={"archiveUser"}
                onPress={archiveUser}
                color="black"
                title={"archive user"}
                backgroundColor="yellow"
              />
              // <AppButton
              //   title={"archive user"}
              //   color="black"
              //   backgroundColor="yellow"
              //   onPress={archiveUser}
              // />
            )}
          </View>
          <View style={styles.buttonRow}>
            <AppButton
              title={"delete user"}
              color="white"
              backgroundColor="danger"
              onPress={onDeleteUser}
            />
            <ChangePasswordModal
              userName={userData.email}
              requireCurrentPassword={false}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  buttonRow: { flexDirection: "row", alignSelf: "center" },
});
export default UserDetailsScreen;
