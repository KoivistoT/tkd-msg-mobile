import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useDispatch, useStore } from "react-redux";
import colors from "../../config/colors";
import { selectCurrenUserId } from "../../store/currentUser";
import { editUserData, saveEditedUserdata } from "../../store/users";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppLoadingIndicator from "./AppLoadingIndicator";
function AppInfoRow({
  info,
  value,
  fieldName,
  editable,
  selectedField,
  setSelectedField,
}) {
  const [fieldValue, setFieldValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [marginLeft, setMarginLeft] = useState(5);
  const store = useStore();
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const currentUserId = selectCurrenUserId(store);
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
      setLoading(true);
      dispatch(
        saveEditedUserdata({ currentUserId, fieldName, value: fieldValue })
      );
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const onShake = (timeCap, repeatTimes) => {
    var counter = 0;
    var cap = timeCap;
    var i = setInterval(async function () {
      setMarginLeft(20);
      setTimeout(() => {
        setMarginLeft(5);
      }, cap / 2);

      cap += timeCap;
      counter++;
      if (counter === repeatTimes) {
        clearInterval(i);
      }
    }, cap);
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
      onPress={() => (editable ? handlePress() : onCanNotEdit())}
      // onPress={() => (editable ? handlePress() : onShake(50, 4))}
    >
      <View style={styles.columnLeft}>
        <AppText styles={styles.info}>{info}</AppText>
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
        </View>
      )}
      {loading && (
        <View style={styles.loadingIndicator}>
          {/* <AppLoadingIndicator /> */}
          <ActivityIndicator></ActivityIndicator>
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
  },

  icon: { alignSelf: "center" },
  loadingIndicator: {
    marginLeft: 10,
  },
  textInput: {
    width: "58%",
    backgroundColor: colors.white,
    height: 19,
    paddingHorizontal: 3,
    paddingTop: 1,

    marginLeft: 7,
    fontSize: 16,
  },
  editRow: {
    flexDirection: "row",
  },
  info: {},
  value: { marginLeft: 10 },
  columnLeft: { width: "40%" },
  columnRight: { width: "60%" },
});

export default AppInfoRow;
