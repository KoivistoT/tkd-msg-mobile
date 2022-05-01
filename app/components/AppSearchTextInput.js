import React, { useRef, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Keyboard,
} from "react-native";
import { TextInput as NativeTextInput } from "react-native";
import colors from "../../config/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { messageFormFocusCleared } from "../../store/general";
import { useDispatch } from "react-redux";

function AppSearchTextInput({
  icon,
  onSearch,
  width = "100%",
  marginTop,
  setShowSearchBar,
  currentSearchWord,
  setShowUnreadMessageButton,
  ...ohterProps
}) {
  const textInput = useRef(null);
  const [searchWord, setSearchWord] = useState(currentSearchWord);
  const dispatch = useDispatch();
  useEffect(() => {
    textInput.current.focus();
    setShowUnreadMessageButton(false);
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={{ flexDirection: "row", paddingHorizontal: 0 }}>
        <TouchableWithoutFeedback
          onPress={() => textInput.current.focus()}
          style={styles.container}
        >
          <View style={{ width: 230 }}>
            <TextInput
              ref={textInput}
              {...ohterProps}
              defaultValue={searchWord ? searchWord : null}
              placeholder="Search word..."
              placeholderTextColor={colors.medium}
              onChangeText={(searchWord) => setSearchWord(searchWord)}
              multiline={false}
              style={{
                height: 40,

                paddingHorizontal: 10,
              }}
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

          
          </View>
        </TouchableWithoutFeedback>

        <TouchableOpacity
          style={{
            alignSelf: "center",
            borderRadius: 5,
            padding: 5,
            backgroundColor: colors.primary,
          }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    zIndex: 20,

    padding: 5,
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    backgroundColor: colors.light,
    borderRadius: 6,
  },
});
export default AppSearchTextInput;
