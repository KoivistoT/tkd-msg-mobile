import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import colors from "../../config/colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AppTouchableIcon from "./AppTouchableIcon";

function AppSearchTextInput({
  onSearch,
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
          onChangeText={(currentWord) => setSearchWord(currentWord)}
          multiline={false}
        />
      </TouchableWithoutFeedback>

      <AppTouchableIcon
        containerStyle={styles.buttonContainer}
        color={colors.white}
        source="ad"
        name="search1"
        size={24}
        onPress={() => onSearch(searchWord)}
      />
      <AppTouchableIcon
        containerStyle={[
          styles.buttonContainer,
          { backgroundColor: colors.medium },
        ]}
        source="fa"
        color={colors.white}
        name="eraser"
        size={24}
        onPress={() => {
          textInput.current.clear();
          setSearchWord(null);
          onSearch();
        }}
      />
      <AppTouchableIcon
        containerStyle={[
          styles.buttonContainer,
          { backgroundColor: colors.danger },
        ]}
        source="ad"
        color={colors.white}
        name="closecircleo"
        size={24}
        onPress={() => {
          textInput.current.clear();
          setSearchWord(null);
          setShowSearchBar(false);
          onSearch();
        }}
      />
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
