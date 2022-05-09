import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Octicons, Feather } from "@expo/vector-icons";
import RoomsNavigator from "./RoomsNavigator";
import ControlNavigator from "./ControlNavigator";
import ContactsNavigator from "./ContactsNavigator";
import UserSetupScreen from "../../screens/UserSetupScreen";

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
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
        name="UserSetup"
        component={UserSetupScreen}
        options={{
          tabBarIcon: () => (
            <Octicons name="settings" size={24} color="black" />
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
