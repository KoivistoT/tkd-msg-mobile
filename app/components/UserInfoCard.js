import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AppText from "./AppText";
import Screen from "./Screen";
import { selectUserById } from "../../store/users";
import AppIcon from "./AppIcon";
import userFuncs from "../../utility/userFuncs";
import AppInfoRow from "./AppInfoRow";
import colors from "../../config/colors";

function UserInfoCard({ userId, hideFields = [], isEditable = false }) {
  const userData = useSelector(selectUserById(userId));

  const [selectedField, setSelectedField] = useState(null);
  const addField = (fieldName, label, toUpperCase = false, editable) => {
    return hideFields.includes(fieldName) ? null : (
      <AppInfoRow
        editable={editable}
        key={fieldName}
        fieldName={fieldName}
        info={label}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        value={
          toUpperCase ? userData[fieldName].toUpperCase() : userData[fieldName]
        }
      />
    );
  };

  return (
    <View style={{ marginBottom: 20 }}>
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
              return addField(
                item.fieldName,
                item.label,
                item.toUpperCase,
                isEditable ? item.editable : false
              );
            })}
          </View>
        </View>
      )}
    </View>
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
    fieldName: "email",
    label: "Email",
    editable: false,
  },
  {
    fieldName: "accountType",
    label: "Account type",
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
    toUpperCase: true,
    editable: true,
  },
  {
    fieldName: "phone",
    label: "Phone",
    editable: true,
  },
];
export default UserInfoCard;
