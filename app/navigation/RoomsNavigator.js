import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RoomsScreen from "../../screens/RoomsScreen.js";
import MessageScreen from "../../screens/MessageScreen.js";
import RoomSetupScreen from "../../screens/RoomSetupScreen.js";
import { CardStyleInterpolators } from "@react-navigation/stack";
const Stack = createStackNavigator();

const PostNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackTitle: "Back",

      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
    <Stack.Screen name="Rooms_screen" component={RoomsScreen} />
    <Stack.Screen name="Message_screen" component={MessageScreen} />
    <Stack.Screen name="Room_setup_screen" component={RoomSetupScreen} />
  </Stack.Navigator>
);
export default PostNavigator;
