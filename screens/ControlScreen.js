import React from "react";
import { FlatList } from "react-native";
import Screen from "../app/components/Screen";
import routes from "../app/navigation/routes";
import AppListItem from "../app/components/AppListItem";

function ControlScreen({ navigation }) {
  const data = [
    { name: "Users", id: "2", onPress: routes.USERS_CONTROL_SCREEN },
  ];

  const renderItem = ({ item }) => (
    <AppListItem
      item={item}
      onPress={() => navigation.navigate(item.onPress, item)}
    />
  );

  return (
    <Screen>
      <FlatList
        data={data}
        bounces={false}
        keyExtractor={(dataItem) => dataItem.id}
        renderItem={renderItem}
      />
    </Screen>
  );
}

export default ControlScreen;
