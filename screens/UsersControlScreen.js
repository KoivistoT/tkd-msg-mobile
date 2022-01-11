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

  useEffect(() => {
    dispatch(getAllUsers());

    //tähän tulisi tulla listener auki,
    //että kuuntelee uusia käyttäjiä, jolloin
    //socketissa siis tulee aina uusi käyttäjä,
    //kun lisätty, eli päivittää silloin listan
    //socket auki ja kiinni tässä, eli ei ole aina päällä? Vai pitäisikö
    //kuunnella koska tulee lista käyttäjistä johonkin.
    //Silloin state muuttuu ja tässäkin tulee selectorissa uudet käyttäjät aina
  }, []);

  const listKeyExtractor = (data) => data._id;

  const listItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => navigation.navigate(routes.USER_DETAILS_SCREEN, item)}
    >
      <View>
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

  return (
    <Screen>
      <CreateUserModal />
      <FlatList
        ItemSeparatorComponent={() => <ListItemSeparator />}
        data={allUsers.users}
        bounces={false}
        keyExtractor={listKeyExtractor}
        renderItem={listItem}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default UsersControlScreen;
