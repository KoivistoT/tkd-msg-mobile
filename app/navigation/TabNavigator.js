import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RoomsNavigator from "./RoomsNavigator";
import RoomsListScreen from "../../screens/RoomsListScreen.js.js";
import ControlScreen from "../../screens/ControlScreen";
import ControlNavigator from "./ControlNavigator";
import ContactsNavigator from "./ContactsNavigator";
import UserSetupScreen from "../../screens/UserSetupScreen";
import { Octicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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
            <MaterialCommunityIcons name="home" color={color} size={size} />
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
          tabBarIcon: ({ color, size }) => (
            <Octicons name="settings" size={24} color="black" />
          ),
        }}
      />
      {/* <Tab.Screen
        name="ControlNavigator"
        component={ControlNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default TabNavigator;
