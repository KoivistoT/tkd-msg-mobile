import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";

import AppText from "../AppText";
import ShowImageModal from "../imageComponents/ShowImageModal";

function MessageItemImage({ item, showImages, setShowImages, SHOW_IMAGES }) {
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
      <View style={styles.ImageModalContainer}>
        {item.imageURLs.slice(0, showImages).map((url) => (
          <ShowImageModal key={url} item={item} image={url} />
        ))}
      </View>
      {isMoreImages && (
        <TouchableOpacity
          style={styles.moreHideButton}
          onPress={() => onMoreLess()}
        >
          <AppText style={styles.moreHideText}>
            {showImages === SHOW_IMAGES ? "More images" : "Hide images"}
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
  moreHideText: {
    color: colors.secondary,
  },
  ImageModalContainer: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
});
export default MessageItemImage;
