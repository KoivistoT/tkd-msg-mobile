import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";

import AppText from "../AppText";
import ShowImageModal from "../imageComponents/ShowImageModal";

const SHOW_IMAGES = 2;
function MessageItemImage({ item }) {
  const [isMoreImages, setIsMoreImages] = useState(false);
  const [showImages, setShowImages] = useState(SHOW_IMAGES);

  let showMore = useRef(false);

  const onMoreLess = () => {
    if (showMore.current) {
      setShowImages(SHOW_IMAGES);
      showMore.current = false;
    } else {
      setShowImages(item.imageURLs.length);
      showMore.current = true;
    }
  };

  useEffect(() => {
    if (item.imageURLs.length > SHOW_IMAGES) setIsMoreImages(true);
  }, []);

  return (
    <View>
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          flex: 1,
        }}
      >
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
            {showMore.current ? "Hide images" : "More images"}
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
});
export default MessageItemImage;
