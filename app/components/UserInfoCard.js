import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import AppText from "./AppText";
import ListItemSeparator from "./ListItemSeparator";
import EditUserModal from "./modals/EditUserModal";
import Screen from "./Screen";

import {
  selectUserById,
  activateUserById,
  archiveOrDeleteUserById,
} from "../../store/users";

import AppButton from "./AppButton";
import { navigationRef } from "../navigation/rootNavigation";
import confirmAlert from "../../utility/confirmAlert";
import AppIcon from "./AppIcon";
import userFuncs from "../../utility/userFuncs";
import AppInfoRow from "./AppInfoRow";
import SectionSeparator from "./SectionSeparator";
import colors from "../../config/colors";

function UserInfoCard({ userId }) {
  const userData = useSelector(selectUserById(userId));

  return (
    <Screen>
      {userData && (
        <View style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <AppIcon />
            <AppText style={{ marginTop: 10 }}>
              {userFuncs.fullName(userData)}
            </AppText>
          </View>

          <View
            style={{
              backgroundColor: colors.background1,
              padding: 10,
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <AppInfoRow info="Displayname" value={userData.displayName} />
            <AppInfoRow info="Phone" value={userData.phone} />
            <AppInfoRow info="Email" value={userData.email} />
          </View>
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
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});
export default UserInfoCard;
