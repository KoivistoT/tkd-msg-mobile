import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";

import AppText from "../AppText";
import ShowImageModal from "../imageComponents/ShowImageModal";

function MessageItemImage({
  onLongPress,
  item,
  showImages,
  setShowImages,
  disapleOnPress = false,
  SHOW_IMAGES,
}) {
  const [isMoreImages, setIsMoreImages] = useState(false);

  useEffect(() => {
    if (item.imageURLs.length > SHOW_IMAGES) setIsMoreImages(true);
  }, []);

  const onMoreLess = () => {
    setShowImages(
      showImages === SHOW_IMAGES ? item.imageURLs.length : SHOW_IMAGES
    );
  };

  return (
    <View>
      {disapleOnPress && (
        <View
          style={{
            position: "absolute",
            opacity: 0,
            flex: 1,
            backgroundColor: "red",
            zIndex: 2,
            height: "100%",
            width: "100%",
          }}
        ></View>
      )}
      <View style={styles.ImageModalContainer}>
        {item.imageURLs.slice(0, showImages).map((url) => (
          <ShowImageModal
            onLongPress={onLongPress}
            key={url}
            item={item}
            image={url}
          />
        ))}
      </View>
      {isMoreImages && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.moreHideButton}
          onPress={() => onMoreLess()}
        >
          <AppText
            style={{
              color: disapleOnPress ? colors.black : colors.primary,
              marginRight: 10,
            }}
          >
            {showImages === SHOW_IMAGES
              ? `${disapleOnPress ? "(" : ""}${
                  item.imageURLs.length - SHOW_IMAGES
                } More image${
                  item.imageURLs.length - SHOW_IMAGES > 1 ? `s` : ""
                }${disapleOnPress ? ")" : ""}`
              : "Hide images"}
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  moreHideButton: {
    alignSelf: "flex-end",
  },

  ImageModalContainer: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
});
export default MessageItemImage;
