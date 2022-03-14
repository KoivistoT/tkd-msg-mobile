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

function CreateNewChannelScreen({}) {
  return (
    <View>
      <Screen>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{ position: "relative", alignSelf: "flex-end", padding: 20 }}
        >
          <MaterialCommunityIcons name="close" size={25} color={colors.dark} />
        </TouchableOpacity>

        <CreateChannelForm closeModal={() => setModalVisible(false)} />
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {},
  button: {},
});

function areEqual(prevProps, nextProps) {
  return true;
}

export const MemoCreateNewChannelScreen = React.memo(
  CreateNewChannelScreen,
  areEqual
);
