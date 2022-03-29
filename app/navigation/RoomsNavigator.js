import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import RoomsListScreen from "../../screens/RoomsListScreen.js";
import MessageScreen from "../../screens/MessageScreen.js";
import RoomSetupScreen from "../../screens/RoomSetupScreen.js";
import { Entypo } from "@expo/vector-icons";
import { navigationRef } from "./rootNavigation.js";
import routes from "./routes.js";
import { MemoReadByList } from "../components/messageItems/ReadByList.js";

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
      <Stack.Screen name="Read_by_list" component={MemoReadByList} />
    </Stack.Group>
  </Stack.Navigator>
);
export default RoomsNavigator;
