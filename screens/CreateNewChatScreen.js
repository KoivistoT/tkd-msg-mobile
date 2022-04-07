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
import AppTitle from "../app/components/AppTitle";

function CreateNewChatScreen({}) {
  return (
    <Screen>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <AppButton
          style={{ alignSelf: "center", padding: 10 }}
          onPress={() =>
            navigationRef.current.navigate(routes.CREATE_CHANNEL_SCREEN)
          }
          buttonWidth={150}
          title={"New channel"}
        ></AppButton>
        <AppButton
          style={{ alignSelf: "center", padding: 10 }}
          onPress={() =>
            navigationRef.current.navigate(routes.CREATE_DIRECT_GROUP_SCREEN)
          }
          buttonWidth={150}
          title={"New group"}
        ></AppButton>
      </View>

      <AppTitle>Start private chat</AppTitle>
      <ContactsScreen showInfoButton={false} />
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
