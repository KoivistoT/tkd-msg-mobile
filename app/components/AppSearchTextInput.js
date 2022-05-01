import React, { useRef, useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { TextInput as NativeTextInput } from "react-native";
import colors from "../../config/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function AppSearchTextInput({
  icon,
  onSearch,
  marginTop,
  setShowSearchBar,
  currentSearchWord,
  setShowUnreadMessageButton,
  ...ohterProps
}) {
  const textInput = useRef(null);
  const [searchWord, setSearchWord] = useState(currentSearchWord);

  useEffect(() => {
    textInput.current.focus();
    setShowUnreadMessageButton(false);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => textInput.current.focus()}
        style={styles.textInputContainer}
      >
        <TextInput
          ref={textInput}
          style={styles.textInput}
          {...ohterProps}
          defaultValue={searchWord ? searchWord : null}
          placeholder="Search word..."
          placeholderTextColor={colors.medium}
          onChangeText={(searchWord) => setSearchWord(searchWord)}
          multiline={false}
          render={(innerProps) => (
            <NativeTextInput
              {...innerProps}
              style={[
                innerProps.style,
                props.multiline
                  ? {
                      paddingTop: 8,
                      paddingBottom: 8,
                      height: 40,
                    }
                  : null,
              ]}
            />
          )}
        />
      </TouchableWithoutFeedback>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => onSearch(searchWord)}
      >
        <AntDesign name="search1" size={24} color={colors.white} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          textInput.current.clear(), setSearchWord(null), onSearch();
        }}
        style={{
          margin: 5,
          alignSelf: "center",
          borderRadius: 5,
          padding: 5,
          backgroundColor: colors.medium,
        }}
      >
        <FontAwesome5 name="eraser" size={24} color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          textInput.current.clear();
          setSearchWord(null);
          setShowSearchBar(false);
          onSearch();
        }}
        style={{
          alignSelf: "center",
          borderRadius: 5,
          padding: 5,

          backgroundColor: colors.danger,
        }}
      >
        <AntDesign name="closecircleo" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: "row",
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: colors.light,
    borderRadius: 6,
  },
  textInput: {
    width: "60%",
  },

  buttonContainer: {
    alignSelf: "center",
    borderRadius: 5,
    marginLeft: 10,
    padding: 5,
    backgroundColor: colors.primary,
  },
  container: {
    zIndex: 20,
    alignSelf: "center",
    flexDirection: "row",
    paddingHorizontal: 0,
    padding: 5,

    alignItems: "center",
  },
});
export default AppSearchTextInput;
