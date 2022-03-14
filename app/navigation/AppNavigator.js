import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RoomsNavigator from "./RoomsNavigator";
import RoomsListScreen from "../../screens/RoomsListScreen.js.js";
import ControlScreen from "../../screens/ControlScreen";
import ControlNavigator from "./ControlNavigator";
import ContactsNavigator from "./ContactsNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import CreateChatNavigator from "./CreateChatNavigator";
import { MemoCreateNewChannelScreen } from "../../screens/CreateNewChannelScreen";
import { MemoCreateNewChatScreen } from "../../screens/CreateNewChatScreen";
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,

        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Group>
        <Stack.Screen name="tab_navigator" component={TabNavigator} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="create_chat_navigator"
          component={CreateChatNavigator}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppNavigator;
