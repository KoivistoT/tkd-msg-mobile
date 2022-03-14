import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { MemoCreateNewChatScreen } from "../../screens/CreateNewChatScreen.js";
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
      <Stack.Screen
        name="create_new_channel_screen"
        component={MemoCreateNewChannelScreen}
      />
    </Stack.Group>
  </Stack.Navigator>
);
export default CreateChatNavigator;
