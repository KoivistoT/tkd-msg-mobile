import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../config/colors";

function ShowSearchBarButton({ onPress }) {
  return (
    <TouchableOpacity
      activeOpacity="0.5"
      style={{ paddingHorizontal: 10, paddingVertical: 7 }}
      onPress={onPress}
    >
      <AntDesign name="search1" size={20} color={colors.black} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
export default ShowSearchBarButton;
