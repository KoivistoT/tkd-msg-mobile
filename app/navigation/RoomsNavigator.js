import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RoomsScreen from "../../screens/RoomsScreen.js";
import MessageScreen from "../../screens/MessageScreen.js";

const Stack = createStackNavigator();

const PostNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Rooms_screen" component={RoomsScreen} />
    <Stack.Screen name="Message_screen" component={MessageScreen} />
  </Stack.Navigator>
);
export default PostNavigator;
