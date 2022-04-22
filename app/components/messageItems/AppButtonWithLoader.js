import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  errorMessageAdded,
  requestStateRemoved,
  requestStatesRemoved,
  selectRequestStateById,
  successMessageAdded,
} from "../../../store/general";
import {
  requestStateCleared,
  selectRoomRequestState,
  selectRoomsErrorMessage,
} from "../../../store/rooms";
import AppButton from "../AppButton";
import AppLoadingIndicator from "../AppLoadingIndicator";

// const STATE_LISTENERS = {
//   rooms: {
//     selector: selectRoomRequestState,
//     clear: requestStateCleared,
//     errorMessage: (store) => selectRoomsErrorMessage(store),
//   },
// };

function AppButtonWithLoader({
  children = null,
  requestId,
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

  const requestState = useSelector(selectRequestStateById(requestId)); // täne saa id:n selector id:llä, loader id, mut miten sen lisää ja poistaa
  const clearFunction = () => dispatch(requestStateRemoved({ id: requestId }));

  // console.log("jaahas");

  useEffect(() => {
    if (requestState.length > 0) stateFunctions(requestState);
  }, [requestState]);

  let initDone = useRef(false);
  const stateFunctions = (requestState) => {
    console.log("täällä päivittää joo", requestState);
    if (!initDone.current) {
      initDone.current = true;
    }
    switch (requestState) {
      case "started":
        setLoading(true);
        // doFunctions(startedFunctions);
        break;
      case "succeed":
        clearFunction();

        setLoading(false);
        doFunctions(succeedFunctions);
        if (successMessage) {
          dispatch(successMessageAdded(successMessage));
        }

        break;
      case "error":
        setLoading(false);
        doFunctions(errorFunctions);
        clearFunction();
        break;
      default:
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
