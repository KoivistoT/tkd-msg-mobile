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
import CreateChatNavigator from "./CreateChatNavigator.js";

const Stack = createStackNavigator();

const RoomsNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackTitle: "Back",

      // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
    <Stack.Group>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigationRef.current.navigate(routes.CREATE_CHAT_NAVIGATOR)
              }
            >
              <Entypo name="new-message" size={22} />
            </TouchableOpacity>
          ),
        }}
        name="Rooms_screen"
        component={RoomsListScreen}
      />
      <Stack.Screen name="Message_screen" component={MessageScreen} />
      <Stack.Screen name="Room_setup_screen" component={RoomSetupScreen} />
    </Stack.Group>
    {/* <Stack.Group
      screenOptions={{
        presentation: "modal",
        headerShown: false,
        modalPresentationStyle: "overCurrentContext",
      }}
    >
      <Stack.Screen
        name="create_new_chat_screen"
        component={CreateChatNavigator}
      />
    </Stack.Group> */}
  </Stack.Navigator>
);
export default RoomsNavigator;
