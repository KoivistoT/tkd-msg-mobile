import React, { useState } from "react";

import Platform from "react-native";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Entypo } from "@expo/vector-icons";

import colors from "../config/colors";
import CreateChannelForm from "../app/components/forms/CreateChannelForm";
import AppButton from "../app/components/AppButton";
import Screen from "../app/components/Screen";
import { navigationRef } from "../app/navigation/rootNavigation";
import routes from "../app/navigation/routes";
import AppText from "../app/components/AppText";
import ContactsScreen from "./ContactsScreen";

function CreateNewChatScreen({}) {
  return (
    <Screen>
      <TouchableOpacity
        onPress={() =>
          navigationRef.current.navigate(routes.CREATE_NEW_CHANNEL_SCREEN)
        }
      >
        <AppText>TÄSTÄ TEE CHANNEL</AppText>
      </TouchableOpacity>

      <ContactsScreen></ContactsScreen>
    </Screen>
  );
}

const styles = StyleSheet.create({
  modal: {},
  button: {},
});

function areEqual(prevProps, nextProps) {
  return true;
}

export const MemoCreateNewChatScreen = React.memo(
  CreateNewChatScreen,
  areEqual
);
