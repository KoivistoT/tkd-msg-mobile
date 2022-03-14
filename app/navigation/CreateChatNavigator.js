import React from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Button,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import RoomsListScreen from "../../screens/RoomsListScreen.js";
import MessageScreen from "../../screens/MessageScreen.js";
import RoomSetupScreen from "../../screens/RoomSetupScreen.js";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { Entypo } from "@expo/vector-icons";
import { navigationRef } from "./rootNavigation.js";
import { MemoCreateNewChatScreen } from "../../screens/CreateNewChatScreen.js";
import routes from "./routes.js";
import { MemoCreateChannelModal } from "../components/modals/CreateChannelModal.js";
import { MemoCreateNewChannelScreen } from "../../screens/CreateNewChannelScreen.js";

const Stack = createStackNavigator();

const CreateChatNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackTitle: "Cansel",
    }}
  >
    <Stack.Group>
      <Stack.Screen
        name="create_new_chat_screen"
        component={MemoCreateNewChatScreen}
      />
    </Stack.Group>
    <Stack.Group>
      <Stack.Screen
        name="create_new_channel_screen"
        component={MemoCreateNewChannelScreen}
      />
    </Stack.Group>
  </Stack.Navigator>
);
export default CreateChatNavigator;
