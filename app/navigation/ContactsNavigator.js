import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ContactsScreen from "../../screens/ContactsScreen";
import UserInfoCardScreen from "../../screens/UserInfoCardScreen";

const Stack = createStackNavigator();

const ContactsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{
        headerTitle: "Contacts",
        headerTitleAlign: "center",
      }}
      name="ContactsScreen"
      component={ContactsScreen}
    />
    <Stack.Screen
      options={{
        headerTitle: "User info",
        headerTitleAlign: "center",
      }}
      name="user_info_card_screen"
      component={UserInfoCardScreen}
    />
  </Stack.Navigator>
);
export default ContactsNavigator;
