import React from "react";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import Screen from "../app/components/Screen";
import { selectAllUsersAllData } from "../store/users";
import routes from "../app/navigation/routes";
import CreateUserModal from "../app/components/modals/CreateUserModal";
import UserControlListItem from "../app/components/UserControlListItem";

function UsersControlScreen({ navigation }) {
  const allUsers = useSelector(selectAllUsersAllData);
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
          data={Object.values(allUsers)}
          bounces={false}
          keyExtractor={listKeyExtractor}
          renderItem={listItem}
          initialNumToRender={20}
        />
      )}
    </Screen>
  );
}

export default UsersControlScreen;
