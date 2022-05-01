import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Linking,
} from "react-native";
import { useDispatch, useStore } from "react-redux";
import colors from "../../config/colors";
import { selectCurrentUserId } from "../../store/currentUser";
import {
  editUserData,
  saveEditedUserdata,
  userDataFieldEdited,
} from "../../store/users";
import AppText from "./AppText";
import createTask from "../../utility/createTask";
import AppTextInput from "./AppTextInput";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppLoadingIndicator from "./AppLoadingIndicator";
import phoneCall from "../../utility/phoneCall";

function AppInfoRow({
  info,
  value,
  fieldName,
  editable,
  selectedField,
  setSelectedField,
  isEditable,
}) {
  const [fieldValue, setFieldValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [marginLeft, setMarginLeft] = useState(5);
  const store = useStore();
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
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
      if (textInput.current) textInput.current.focus();
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

  const [showCanNotEdit, setShowCanNotEdit] = useState(false);
  const onCanNotEdit = () => {
    setShowCanNotEdit(true);
    setTimeout(() => {
      setShowCanNotEdit(false);
    }, 2000);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, { marginLeft }]}
      onPress={() =>
        editable
          ? handlePress()
          : showCanNotEdit
          ? null
          : isEditable
          ? onCanNotEdit()
          : null
      }
    >
      <View style={styles.columnLeft}>
        <AppText styles={styles.info}>
          {fieldName === "email" && isEditable ? info + "/username" : info}
        </AppText>
      </View>
      {edit && !loading && (
        <View style={styles.editRow}>
          <TextInput
            ref={textInput}
            style={styles.textInput}
            placeholder={info}
            defaultValue={fieldValue}
            onChangeText={(text) => setFieldValue(text)}
          />
          <View style={styles.buttonsGroup}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onSaveChanges(true)}
              style={[styles.button, { backgroundColor: colors.success }]}
            >
              <MaterialCommunityIcons
                name="content-save"
                size={16}
                color={colors.white}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onSaveChanges(false)}
              style={[styles.button, { backgroundColor: colors.danger }]}
            >
              <AntDesign
                style={styles.icon}
                name="closecircleo"
                size={16}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!edit && !loading && (
        <View style={styles.columnRight}>
          <AppText style={styles.value}>{value}</AppText>

          {fieldName === "phone" && value !== "" && value && !isEditable && (
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => phoneCall(value)}
            >
              <MaterialCommunityIcons
                name="phone-outline"
                size={20}
                color={colors.success}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator/>
        </View>
      )}
      {showCanNotEdit && (
        <View style={styles.canNotEditTextContainer}>
          <AppText style={styles.canNotEditText}>Can not edit</AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}

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
  },
  buttonsGroup: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
    alignSelf: "center",
  },
  button: {
    backgroundColor: colors.success,
    borderRadius: 6,
    alignSelf: "center",
    padding: 7,
    marginLeft: 5,
    width: 30,
    height: 30,
    bottom: 4,
  },
  callButton: { paddingLeft: 5 },
  icon: { alignSelf: "center" },
  loadingIndicator: {
    marginLeft: 10,
  },
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
