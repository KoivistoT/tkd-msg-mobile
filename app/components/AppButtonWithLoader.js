import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import colors from "../../config/colors";
import {
  requestStateRemoved,
  selectRequestStateById,
  successMessageAdded,
} from "../../store/general";
import AppButton from "./AppButton";
import AppLoadingIndicator from "./AppLoadingIndicator";

const AppButtonWithLoader = ({
  children = null,
  requestId,
  initFunctions = [],
  succeedFunctions = [],
  errorFunctions = [],
  loaderType = "circle",
  successMessage = null,
  onPress = null,
  color,
  title = null,
  backgroundColor = null,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const requestState = useSelector(selectRequestStateById(requestId));
  const clearFunction = () => dispatch(requestStateRemoved({ id: requestId }));

  useEffect(() => {
    if (requestState.length > 0) {
      stateFunctions(requestState[0].state);
    }
  }, [requestState]);

  const prevState = useRef(null);
  const initDone = useRef(false);

  const stateFunctions = (currentState) => {
    if (!initDone.current) {
      initDone.current = true;
    }

    if (currentState === prevState.current) {
      return;
    }
    switch (currentState) {
      case "started":
        prevState.current = currentState;
        setLoading(true);
        break;
      case "succeed":
        prevState.current = currentState;
        executeFunctions(succeedFunctions);
        if (successMessage) {
          dispatch(successMessageAdded(successMessage));
        }
        setLoading(false);
        clearFunction();
        break;
      case "error":
        prevState.current = currentState;
        setLoading(false);
        executeFunctions(errorFunctions);
        clearFunction();
        break;
      default:
        prevState.current = currentState;
        executeFunctions(initFunctions);
        setLoading(false);
        break;
    }
  };

  const executeFunctions = (functionArray) => {
    functionArray.forEach((func) => {
      func();
    });
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loading}>
          {loaderType === "dots" ? (
            <AppLoadingIndicator />
          ) : (
            <ActivityIndicator color={colors.danger} />
          )}
        </View>
      )}
      {children ? (
        <>{children}</>
      ) : (
        <AppButton
          color={color}
          backgroundColor={backgroundColor}
          title={title}
          onPress={onPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignSelf: "center", marginTop: 20 },
  loading: {
    top: 14,
    position: "absolute",
    zIndex: 2,
    flex: 1,
  },
});

export default AppButtonWithLoader;
