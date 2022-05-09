import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AppText from "./AppText";
import { selectUserById } from "../../store/users";
import AppIcon from "./AppIcon";
import userFuncs from "../../utility/userFuncs";
import AppInfoRow from "./AppInfoRow";
import colors from "../../config/colors";

function UserInfoCard({ userId, hideFields = [], isEditable = false }) {
  const userData = useSelector(selectUserById(userId));

  const [selectedField, setSelectedField] = useState(null);

  const isTextUpperCase = (shoulBeUpperCase, fieldName) => {
    return shoulBeUpperCase
      ? userData[fieldName].toUpperCase()
      : userData[fieldName];
  };

  const addField = (fieldName, label, editable, toUpperCase = false) => {
    return hideFields.includes(fieldName) ? null : (
      <AppInfoRow
        editable={editable}
        isEditable={isEditable}
        key={fieldName}
        fieldName={fieldName}
        info={label}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        value={isTextUpperCase(toUpperCase, fieldName)}
      />
    );
  };

  return (
    <View style={{ marginBottom: 20 }}>
      {userData && (
        <View style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <AppIcon
              icon={{ color: "background1", name: "account", size: 90 }}
            />
            <AppText>{userFuncs.fullName(userData)}</AppText>
          </View>

          <View style={styles.fields}>
            {allFields.map((item) => {
              return addField(
                item.fieldName,
                item.label,
                isEditable ? item.editable : false,
                item.toUpperCase
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fields: {
    backgroundColor: colors.background1,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});

const allFields = [
  {
    fieldName: "status",
    label: "Status",
    editable: false,
  },
  {
    fieldName: "email",
    label: "Email",
    editable: true,
  },
  {
    fieldName: "accountType",
    label: "Account type",
    toUpperCase: true,
    editable: false,
  },
  {
    fieldName: "firstName",
    label: "First name",
    editable: true,
  },
  {
    fieldName: "lastName",
    label: "Last name",
    editable: true,
  },

  {
    fieldName: "displayName",
    label: "Display name",
    toUpperCase: false,
    editable: true,
  },
  {
    fieldName: "phone",
    label: "Phone",
    editable: true,
  },
];
export default UserInfoCard;
