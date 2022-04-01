import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { MemoCreateNewChatScreen } from "../../screens/CreateNewChatScreen.js";
import { MemoCreateChannelScreen } from "../../screens/CreateChannelScreen.js";
import { MemoCreateDirectGroupScreen } from "../../screens/CreateDirectGroupScreen.js";

const Stack = createStackNavigator();

const CreateChatNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackTitle: "Cancel",
    }}
  >
    <Stack.Group>
      <Stack.Screen
        name="create_new_chat_screen"
        component={MemoCreateNewChatScreen}
      />
      <Stack.Screen
        name="create_channel_screen"
        component={MemoCreateChannelScreen}
      />
      <Stack.Screen
        name="create_direct_group_screen"
        component={MemoCreateDirectGroupScreen}
      />
    </Stack.Group>
  </Stack.Navigator>
);
export default CreateChatNavigator;
