import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { getAllUsers } from "../store/users";
import colors from "../config/colors";
import routes from "../app/navigation/routes";
import AppButton from "../app/components/AppButton";
import CreateUserModal from "../app/components/modals/CreateUserModal";

function UsersControlScreen({ navigation }) {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.entities.users);
  console.log(allUsers);
  useEffect(() => {
    dispatch(getAllUsers());
    // return () => {
    //     cleanup
    // }
  }, []);

  return (
    <Screen>
      <CreateUserModal />
      <FlatList
        ItemSeparatorComponent={() => <ListItemSeparator />}
        data={allUsers.users}
        bounces={false}
        keyExtractor={(data) => data._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate(routes.USER_DETAILS_SCREEN, item)
            }
          >
            <View style={styles.container2}>
              <View style={styles.detailsContainer}>
                <AppText style={styles.name}>{item.name}</AppText>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={25}
                color={colors.dark}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default UsersControlScreen;