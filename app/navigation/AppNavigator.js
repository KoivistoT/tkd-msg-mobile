import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import CreateChatNavigator from "./CreateChatNavigator";
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
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
