import React from "react";
import { View, StyleSheet, Button, Text, TouchableOpacity } from "react-native";
import Toast, { DURATION } from "react-native-easy-toast";
import { connect } from "react-redux";
import Constants from "expo-constants";
import colors from "../../config/colors";
import { errorMessageCleared } from "../../store/general";
import { usersErrorMessageCleared } from "../../store/users";
import { roomsErrorMessageCleared } from "../../store/rooms";

class AppErrorToast extends React.Component {
  componentDidUpdate(prevProps, nextProps) {
    if (prevProps !== nextProps && this.props.errorMessage) {
      this.toast.show(
        this.props.errorMessage,
        this.props.errorMessageVisibleTime
      );
      this.props.clearErrorMessage();
    }
    if (prevProps !== nextProps && this.props.usersErrorMessage) {
      this.toast.show(
        this.props.usersErrorMessage,
        this.props.errorMessageVisibleTime
      );
      this.props.clearUsersErrorMessage();
    }
    if (prevProps !== nextProps && this.props.roomsErrorMessage) {
      this.toast.show(
        this.props.roomsErrorMessage,
        this.props.errorMessageVisibleTime
      );
      this.props.clearRoomsErrorMessage();
    }
  }

  render() {
    return (
      <View
        style={{
          position: "absolute",
          alignSelf: "center",
          zIndex: 100,
          width: "100%",
          marginTop: Constants.statusBarHeight,
        }}
      >
        <Toast
          ref={(toast) => (this.toast = toast)}
          style={{ backgroundColor: colors.danger }}
          position="top"
          positionValue={0}
          fadeInDuration={200}
          fadeOutDuration={200}
          // opacity={0.8}
          textStyle={{ color: colors.white }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  errorMessage: state.entities.general.errorMessage,
  usersErrorMessage: state.entities.users.errorMessage,
  roomsErrorMessage: state.entities.rooms.errorMessage,
  errorMessageVisibleTime: state.entities.general.errorMessageVisibleTime,
});

const mapDispatchToProps = (dispatch) => ({
  clearErrorMessage: () => dispatch(errorMessageCleared()),
  clearUsersErrorMessage: () => dispatch(usersErrorMessageCleared()),
  clearRoomsErrorMessage: () => dispatch(roomsErrorMessageCleared()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AppErrorToast);
