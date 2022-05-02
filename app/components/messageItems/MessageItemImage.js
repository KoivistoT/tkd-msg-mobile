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
      {disapleOnPress && <View style={styles.cover} />}
      <View style={styles.imageModalContainer}>
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
            style={[
              styles.text,
              {
                color: disapleOnPress ? colors.black : colors.primary,
              },
            ]}
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
  cover: {
    position: "absolute",
    opacity: 0,
    flex: 1,
    backgroundColor: "red",
    zIndex: 2,
    height: "100%",
    width: "100%",
  },
  moreHideButton: {
    alignSelf: "flex-end",
  },

  imageModalContainer: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  text: { marginRight: 10 },
});
export default MessageItemImage;
