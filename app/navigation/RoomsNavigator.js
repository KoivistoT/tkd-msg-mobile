import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RoomsListScreen from "../../screens/RoomsListScreen.js";
import MessageScreen from "../../screens/MessageScreen.js";
import RoomSetupScreen from "../../screens/RoomSetupScreen.js";
import { MemoReadByList } from "../components/messageItems/ReadByList.js";
import HeaderRightNewRoom from "../components/HeaderRightNewRoom.js";

const Stack = createStackNavigator();

const RoomsNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackTitle: "Back",
    }}
  >
    <Stack.Group>
      <Stack.Screen
        options={{
          headerTitle: "Chats",
          headerTitleAlign: "center",
          headerRight: () => <HeaderRightNewRoom />,
        }}
        name="Rooms_screen"
        component={RoomsListScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTitleAlign: "center",
        }}
        name="Message_screen"
        component={MessageScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: "Chat details",
          headerTitleAlign: "center",
        }}
        name="Room_setup_screen"
        component={RoomSetupScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: "Read by list",
          headerTitleAlign: "center",
        }}
        name="Read_by_list"
        component={MemoReadByList}
      />
    </Stack.Group>
  </Stack.Navigator>
);
export default RoomsNavigator;
