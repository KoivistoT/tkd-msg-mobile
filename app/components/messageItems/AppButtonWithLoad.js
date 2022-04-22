import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { successMessageAdded } from "../../../store/general";
import {
  requestStateCleared,
  selectRoomRequestState,
} from "../../../store/rooms";
import AppLoadingIndicator from "../AppLoadingIndicator";

const STATE_LISTENERS = {
  rooms: { selector: selectRoomRequestState, clear: requestStateCleared },
};

function AppButtonWithLoad({
  children,
  listenRequest = null,
  initFunctions = [],
  startedFunctions = [],
  succeedFunctions = [],
  loaderType = "circle",
  successMessage = null,
}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const requestState = useSelector(STATE_LISTENERS[listenRequest].selector);
  const clearFunction = () => dispatch(STATE_LISTENERS[listenRequest].clear());

  useEffect(() => {
    stateFunctions(requestState);
  }, [requestState]);

  const stateFunctions = (requestState) => {
    switch (requestState) {
      case "started":
        setLoading(true);
        doFunctions(startedFunctions);
        break;
      case "succeed":
        clearFunction();
        doFunctions(succeedFunctions);
        if (successMessage) {
          dispatch(successMessageAdded(successMessage));
        }
        setLoading(false);
        break;
      default:
        clearFunction();
        doFunctions(initFunctions);
        setLoading(false);
        break;
    }
  };

  const doFunctions = (functionArray) => {
    functionArray.forEach((func) => {
      func();
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View
          style={{
            height: 45,
            alignSelf: "center",
            flexDirection: "row",
          }}
        >
          {loaderType === "dots" ? (
            <AppLoadingIndicator />
          ) : (
            <ActivityIndicator />
          )}
        </View>
      ) : (
        <>{children}</>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignSelf: "center", marginTop: 20 },
});

export default AppButtonWithLoad;
