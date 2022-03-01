import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../app/components/AppText";
import ListItemSeparator from "../app/components/ListItemSeparator";
import Screen from "../app/components/Screen";
import { allUsers } from "../store/users";
import colors from "../config/colors";
import routes from "../app/navigation/routes";
import CreateUserModal from "../app/components/modals/CreateUserModal";
import AppButton from "../app/components/AppButton";
import { createRoom } from "../store/rooms";

function ContactsScreen({ navigation }) {
  const dispatch = useDispatch();
  const store = useStore();
  const userId = store.getState().auth.currentUser._id;
  const allUsersList = useSelector(allUsers());

  const listKeyExtractor = (data) => data._id;

  const startConversation = (item) => {
    console.log("täällä tekee huonetta");
    dispatch(createRoom("private", "private", userId, item._id));
  };

  const listItem = ({ item }) => (
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
        <AppButton
          title="uusi keskustelu"
          onPress={() => startConversation(item)}
        />
        <MaterialCommunityIcons
          name="chevron-right"
          size={25}
          color={colors.dark}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen>
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
export default ContactsScreen;
