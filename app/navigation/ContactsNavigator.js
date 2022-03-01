import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ContactsScreen from "../../screens/ContactsScreen";

const Stack = createStackNavigator();

const ContactsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="ContactsScreen" component={ContactsScreen} />
  </Stack.Navigator>
);
export default ContactsNavigator;
