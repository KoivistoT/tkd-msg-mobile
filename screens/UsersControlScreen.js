import React, { useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";

import { allUsers, selectAllUsersAllData } from "../store/users";
import routes from "../app/navigation/routes";
import CreateUserModal from "../app/components/modals/CreateUserModal";
import UserControlListItem from "../app/components/UserControlListItem";

function UsersControlScreen({ navigation }) {
  const allUsers = useSelector(selectAllUsersAllData);
  // console.log("User control screen päivittyy");
  const listKeyExtractor = (data) => data._id;

  const listItem = ({ item }) =>
    item.status === "deleted" ? null : (
      <UserControlListItem
        onPress={() => navigation.navigate(routes.USER_DETAILS_SCREEN, item)}
        item={item}
      />
    );

  return (
    <Screen>
      <CreateUserModal />
      {allUsers && (
        <FlatList
          ItemSeparatorComponent={() => <ListItemSeparator />}
          data={Object.values(allUsers)}
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
