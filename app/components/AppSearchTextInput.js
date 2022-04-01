import React, { useRef, useContext, useState } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { TextInput as NativeTextInput } from "react-native";
import colors from "../../config/colors";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function AppSearchTextInput({
  icon,
  onSearch,
  width = "100%",
  marginTop,
  reverseMessages,
  ...ohterProps
}) {
  const textInput = useRef(null);
  const [searchWord, setSearchWord] = useState(null);

  return (
    <View style={styles.mainContainer}>
      <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
        {icon && (
          <MaterialCommunityIcons name={icon} size={20} style={styles.icon} />
        )}
        <TouchableWithoutFeedback
          onPress={() => textInput.current.focus()}
          style={styles.container}
        >
          <View style={{ width: "75%" }}>
            <TextInput
              ref={textInput}
              {...ohterProps}
              placeholder="Search word..."
              onChangeText={(text) => setSearchWord(text)}
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

            {/* <TextInput
            // maxFontSizeMultiplier={0}

            // allowFontScaling={false}
            multiline={false}
            ref={textInput}
            placeholderTextColor={defaultStyles.colors.medium}
            // style={[defaultStyles.text]}
            style={{ fontSize: 80 }}
            {...ohterProps}
          /> */}
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
        {/* <TouchableOpacity
          onPress={() => {
            // textInput.current.clear(),
            //   setSearchWord(null),
            //   onSearch(),
            reverseMessages();
          }}
          style={{
            margin: 5,
            alignSelf: "center",
            borderRadius: 5,
            padding: 5,
            backgroundColor: colors.medium,
          }}
        >
          <FontAwesome name="exchange" size={24} color={colors.white} />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            textInput.current.clear(), setSearchWord(null), onSearch();
          }}
          style={{
            margin: 5, // tämä pois
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
    top: 15,
    zIndex: 20,
    backgroundColor: colors.light,
    padding: 5,
  },
  container: {
    flexDirection: "row",
    marginRight: 50,
  },
  icon: {
    marginRight: 10,
  },
});
export default AppSearchTextInput;
