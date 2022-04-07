import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AppText from "./AppText";
import Screen from "./Screen";
import { selectUserById } from "../../store/users";
import AppIcon from "./AppIcon";
import userFuncs from "../../utility/userFuncs";
import AppInfoRow from "./AppInfoRow";
import colors from "../../config/colors";

function UserInfoCard({ userId, hideFields = [] }) {
  const userData = useSelector(selectUserById(userId));

  const addField = (fieldName, label, toUpperCase = false) => {
    return hideFields.includes(fieldName) ? null : (
      <AppInfoRow
        key={fieldName}
        info={label}
        value={
          toUpperCase ? userData[fieldName].toUpperCase() : userData[fieldName]
        }
      />
    );
  };

  return (
    <Screen>
      {userData && (
        <View style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <AppIcon size={90} />
            <AppText style={{ marginTop: 10 }}>
              {userFuncs.fullName(userData)}
            </AppText>
          </View>

          <View style={styles.fields}>
            {allFields.map((item) => {
              return addField(item.fieldName, item.label, item.toUpperCase);
            })}
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  fields: {
    backgroundColor: colors.background1,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});

const allFields = [
  {
    fieldName: "firstName",
    label: "First name",
  },
  {
    fieldName: "lastName",
    label: "Last name",
  },
  {
    fieldName: "accountType",
    label: "Account type",
  },
  {
    fieldName: "displayName",
    label: "Display name",
    toUpperCase: true,
  },
  {
    fieldName: "phone",
    label: "Phone",
  },
  {
    fieldName: "email",
    label: "Email",
  },
];
export default UserInfoCard;
