import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RoomsNavigator from "./RoomsNavigator";
import RoomsListScreen from "../../screens/RoomsListScreen.js.js";
import ControlScreen from "../../screens/ControlScreen";
import ControlNavigator from "./ControlNavigator";
import ContactsNavigator from "./ContactsNavigator";
import { Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="RoomsNavigator"
        component={RoomsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chat-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ContactsNavigator"
        component={ContactsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="card-account-details-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ControlNavigator"
        component={ControlNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;
