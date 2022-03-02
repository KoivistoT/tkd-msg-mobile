import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../app/components/Screen";
import routes from "../app/navigation/routes";
import AppText from "../app/components/AppText";
import colors from "../config/colors";
import ListItemSeparator from "../app/components/ListItemSeparator";

function ControlScreen({ navigation }) {
  const data = [
    { name: "Users", id: "2", onPress: routes.USERS_CONTROL_SCREEN },
  ];

  return (
    <Screen>
      <FlatList
        ItemSeparatorComponent={() => <ListItemSeparator />}
        data={data}
        bounces={false}
        keyExtractor={(data) => data.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate(item.onPress, item)}
          >
            <View>
              <View>
                <AppText style={styles.name}>{item.name}</AppText>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={25}
                color={colors.dark}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
export default ControlScreen;
