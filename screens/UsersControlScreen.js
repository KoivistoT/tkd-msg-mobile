import React, { useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { allUsers, getAllUsers } from "../store/usersControl";
import routes from "../app/navigation/routes";
import CreateUserModal from "../app/components/modals/CreateUserModal";
import UserControlListItem from "../app/components/UserControlListItem";

function UsersControlScreen({ navigation }) {
  const dispatch = useDispatch();
  const allUsersList = useSelector(allUsers());

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

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
