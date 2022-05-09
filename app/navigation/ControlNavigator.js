import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ControlScreen from "../../screens/ControlScreen.js";
import UsersControlScreen from "../../screens/UsersControlScreen.js";
import UserDetailsScreen from "../../screens/UserDetailsScreen.js";

const Stack = createStackNavigator();

const ControlNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackTitle: "Back",
    }}
  >
    <Stack.Screen
      options={{ title: "Setup", headerTitleAlign: "center" }}
      name="Control_screen"
      component={ControlScreen}
    />
    <Stack.Screen
      options={{ title: "Users", headerTitleAlign: "center" }}
      name="Users_control_screen"
      component={UsersControlScreen}
    />
    <Stack.Screen
      options={{ title: "User details", headerTitleAlign: "center" }}
      name="User_details_screen"
      component={UserDetailsScreen}
    />
  </Stack.Navigator>
);
export default ControlNavigator;
