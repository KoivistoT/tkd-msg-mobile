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
  color,
  title = null,
  backgroundColor = null,
}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const store = useStore();

  const requestState = useSelector(selectRequestStateById(requestId)); // täne saa id:n selector id:llä, loader id, mut miten sen lisää ja poistaa
  const clearFunction = () => dispatch(requestStateRemoved({ id: requestId }));

  useEffect(() => {
    if (requestState.length > 0) stateFunctions(requestState[0].state);
  }, [requestState]);

  let prevState = useRef(null);
  let initDone = useRef(false);
  const stateFunctions = (requestState) => {
    if (!initDone.current) {
      initDone.current = true;
    }

    if (requestState === prevState.current) return;

    switch (requestState) {
      case "started":
        prevState.current = requestState;
        setLoading(true);
        // console.log("käy täällä started");
        // doFunctions(startedFunctions);

        break;
      case "succeed":
        prevState.current = requestState;
        doFunctions(succeedFunctions);
        if (successMessage) {
          dispatch(successMessageAdded(successMessage));
        }
        setLoading(false);
        clearFunction();
        break;
      case "error":
        prevState.current = requestState;
        setLoading(false);
        doFunctions(errorFunctions);
        clearFunction();
        break;
      default:
        prevState.current = requestState;
        doFunctions(initFunctions);
        setLoading(false);
        // clearFunction(); ????
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
          color={color}
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
