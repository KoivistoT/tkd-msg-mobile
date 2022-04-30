import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CreateChatNavigator from "./CreateChatNavigator";
import AdminTabNavigator from "./AdminTabNavigator";
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name="admin_tab_navigator"
          component={AdminTabNavigator}
        />
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
