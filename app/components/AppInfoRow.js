import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useDispatch, useStore } from "react-redux";
import colors from "../../config/colors";
import { selectCurrentUserId } from "../../store/currentUser";
import { saveEditedUserdata, userDataFieldEdited } from "../../store/users";
import AppText from "./AppText";
import AppTouchableIcon from "./AppTouchableIcon";
import phoneCall from "../../utility/phoneCall";
import InfoRowButtons from "./InfoRowButtons";

const AppInfoRow = ({
  info,
  value,
  fieldName,
  editable,
  selectedField,
  setSelectedField,
  isEditable,
}) => {
  const store = useStore();
  const dispatch = useDispatch();
  const [fieldValue, setFieldValue] = useState(value);
  const [edit, setEdit] = useState(false);
  const [showCanNotEdit, setShowCanNotEdit] = useState(false);
  const currentUserId = selectCurrentUserId(store);
  const textInput = useRef(null);

  useEffect(() => {
    if (selectedField !== fieldName) {
      setEdit(false);
    }
  }, [selectedField]);

  const handlePress = () => {
    setSelectedField(fieldName);
    setEdit(true);
    setFieldValue(value);

    setTimeout(() => {
      if (textInput.current) {
        textInput.current.focus();
      }
    }, 10);
  };

  const onSaveChanges = (save) => {
    setSelectedField(null);
    setEdit(false);

    if (save && fieldValue !== value) {
      const payload = { currentUserId, fieldName, value: fieldValue };
      dispatch(userDataFieldEdited([payload]));
      dispatch(saveEditedUserdata(payload));
    }
  };

  const onCanNotEdit = () => {
    setShowCanNotEdit(true);
    setTimeout(() => {
      setShowCanNotEdit(false);
    }, 2000);
  };

  const getOnPressFunction = (
    isRowEditable,
    showCanNotEditText,
    isFormEditable
  ) => {
    if (isRowEditable) {
      return handlePress();
    }

    if (!isRowEditable && !showCanNotEditText && isFormEditable) {
      return onCanNotEdit();
    }

    return null;
  };

  const getEmailRowText = (nameOfField, isRowEditable) => {
    if (nameOfField === "email" && isRowEditable) {
      return info + "/username";
    } else {
      return info;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container]}
      onPress={() => getOnPressFunction(editable, showCanNotEdit, isEditable)}
    >
      <View style={styles.columnLeft}>
        <AppText styles={styles.info}>
          {getEmailRowText(fieldName, isEditable)}
        </AppText>
      </View>
      {edit && (
        <View style={styles.editRow}>
          <TextInput
            ref={textInput}
            style={styles.textInput}
            placeholder={info}
            defaultValue={fieldValue}
            onChangeText={(text) => setFieldValue(text)}
          />
          <InfoRowButtons
            onSaveChanges={() => onSaveChanges(true)}
            onNotSaveChanges={() => onSaveChanges(false)}
          />
        </View>
      )}
      {!edit && (
        <View style={styles.columnRight}>
          <AppText style={styles.value}>{value}</AppText>

          {fieldName === "phone" && value !== "" && value && !isEditable && (
            <AppTouchableIcon
              source="mci"
              style={styles.callButton}
              color={colors.success}
              name="phone-outline"
              onPress={() => phoneCall(value)}
            />
          )}
        </View>
      )}

      {showCanNotEdit && (
        <View style={styles.canNotEditTextContainer}>
          <AppText style={styles.canNotEditText}>Can not edit</AppText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  canNotEditTextContainer: {
    backgroundColor: "red",
    position: "absolute",
    right: 0,
    padding: 4,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  canNotEditText: { color: colors.white },
  container: {
    flexDirection: "row",
    marginVertical: 5,
    marginTop: 10,
    marginLeft: 5,
  },
  callButton: { paddingLeft: 5 },
  textInput: {
    width: "58%",
    backgroundColor: colors.white,
    height: 28,
    paddingBottom: 0,
    paddingLeft: 6,
    marginLeft: 4,
    fontSize: 16,
    bottom: 4,
  },
  editRow: {
    flexDirection: "row",
  },
  value: { marginLeft: 10 },
  columnLeft: { width: "40%" },
  columnRight: { width: "60%", flexDirection: "row", height: 28 },
});

export default AppInfoRow;
