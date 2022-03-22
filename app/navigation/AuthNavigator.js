// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";

// import LoginScreen from "../../screens/LoginScreen";
// // import RegisterScreen from "../screens/RegisterScreen";

// const Stack = createStackNavigator();

// const AuthNavigator = () => (
//   <Stack.Navigator
//     screenOptions={({ route, navigation }) => ({
//       // headerShown: false,
//     })}
//   >
//     <Stack.Screen name="Login" component={LoginScreen} />
//     {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
//   </Stack.Navigator>
// );

// export default AuthNavigator;

import TestScreen from "../../screens/TestScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={TestScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
