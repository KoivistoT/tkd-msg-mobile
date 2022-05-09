import React from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../app/components/AppButton";
import Screen from "../app/components/Screen";
import { navigate } from "../app/navigation/rootNavigation";
import routes from "../app/navigation/routes";
import ContactsScreen from "./ContactsScreen";
import AppTitle from "../app/components/AppTitle";

function CreateNewChatScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <AppButton
          style={styles.button}
          onPress={() => navigate(routes.CREATE_CHANNEL_SCREEN)}
          buttonWidth={150}
          title={"New channel"}
        ></AppButton>
        <AppButton
          style={styles.button}
          onPress={() => navigate(routes.CREATE_DIRECT_GROUP_SCREEN)}
          buttonWidth={150}
          title={"New group"}
        ></AppButton>
      </View>

      <AppTitle>Start private chat</AppTitle>
      <ContactsScreen showInfoButton={false} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  button: { alignSelf: "center", padding: 10 },
});

export const MemoCreateNewChatScreen = React.memo(CreateNewChatScreen);
