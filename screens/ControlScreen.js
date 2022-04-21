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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.5}
      style={{
        paddingHorizontal: 20,
        padding: 10,
        backgroundColor: colors.primary,
        width: "90%",
        alignSelf: "center",
        borderRadius: 5,
      }}
      onPress={() => navigation.navigate(item.onPress, item)}
    >
      <View style={{ flexDirection: "row" }}>
        <View>
          <AppText style={styles.name}>{item.name}</AppText>
        </View>

        <MaterialCommunityIcons
          style={{ position: "absolute", right: 0, alignSelf: "center" }}
          name="chevron-right"
          size={25}
          color={colors.white}
        />
      </View>
    </TouchableOpacity>
  );
  // console.log("control screen päivittyy");
  return (
    <Screen>
      <FlatList
        ItemSeparatorComponent={() => <ListItemSeparator />}
        data={data}
        bounces={false}
        keyExtractor={(data) => data.id}
        renderItem={renderItem}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({ name: { color: colors.white } });
export default ControlScreen;
