import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { allUsers, getAllUsers } from "../store/usersControl";
import colors from "../config/colors";
import routes from "../app/navigation/routes";
import CreateUserModal from "../app/components/modals/CreateUserModal";

function UsersControlScreen({ navigation }) {
  const dispatch = useDispatch();
  const allUsersList = useSelector(allUsers());

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  const listKeyExtractor = (data) => data._id;

  const listItem = ({ item }) => {
    if (item.status === "deleted") return;

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate(routes.USER_DETAILS_SCREEN, item)}
      >
        <View
          style={{
            backgroundColor: item.status === "archived" ? "yellow" : "white",
          }}
        >
          <View>
            <AppText style={styles.name}>{item.firstName}</AppText>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={25}
            color={colors.dark}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <CreateUserModal />
      {allUsersList && (
        <FlatList
          ItemSeparatorComponent={() => <ListItemSeparator />}
          data={Object.values(allUsersList)}
          bounces={false}
          keyExtractor={listKeyExtractor}
          renderItem={listItem}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default UsersControlScreen;
