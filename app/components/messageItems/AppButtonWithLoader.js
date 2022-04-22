import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import { errorMessageAdded, successMessageAdded } from "../../../store/general";
import {
  requestStateCleared,
  selectRoomRequestState,
  selectRoomsErrorMessage,
} from "../../../store/rooms";
import AppButton from "../AppButton";
import AppLoadingIndicator from "../AppLoadingIndicator";

const STATE_LISTENERS = {
  rooms: {
    selector: selectRoomRequestState,
    clear: requestStateCleared,
    errorMessage: (store) => selectRoomsErrorMessage(store),
  },
};

function AppButtonWithLoader({
  children = null,
  listenRequest,
  initFunctions = [],
  startedFunctions = [],
  succeedFunctions = [],
  errorFunctions = [],
  loaderType = "circle",
  successMessage = null,
  onPress = null,
  title = null,
  backgroundColor = null,
}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const store = useStore();

  const requestState = useSelector(STATE_LISTENERS[listenRequest].selector); // täne saa id:n selector id:llä, loader id, mut miten sen lisää ja poistaa
  const clearFunction = () => dispatch(STATE_LISTENERS[listenRequest].clear());
  alert("genrealissa tuo seuranta request statesta idn avulla");
  // console.log("jaahas");

  useEffect(() => {
    if (requestState) stateFunctions(requestState);
  }, [requestState]);

  let initDone = useRef(false);
  const stateFunctions = (requestState) => {
    // console.log("täällä päivittää joo", requestState);
    if (!initDone.current) {
      clearFunction();
      initDone.current = true;
    }
    switch (requestState) {
      case "started":
        setLoading(true);
        // doFunctions(startedFunctions);
        break;
      case "succeed":
        clearFunction();
        doFunctions(succeedFunctions);
        if (successMessage) {
          dispatch(successMessageAdded(successMessage));
        }
        setLoading(false);
        break;
      case "error":
        setLoading(false);
        dispatch(
          errorMessageAdded(STATE_LISTENERS[listenRequest].errorMessage(store))
        );
        doFunctions(errorFunctions);
        clearFunction();
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
      ) : children ? (
        <>{children}</>
      ) : (
        <AppButton
          backgroundColor={backgroundColor}
          title={title}
          onPress={onPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignSelf: "center", marginTop: 20 },
});

export default AppButtonWithLoader;
