import React from "react";
import { View, StyleSheet } from "react-native";
import Toast from "react-native-easy-toast";
import { connect } from "react-redux";
import Constants from "expo-constants";
import colors from "../../config/colors";
import { errorMessageCleared } from "../../store/general";
import { usersErrorMessageCleared } from "../../store/users";
import { roomsErrorMessageCleared } from "../../store/rooms";

class AppErrorToast extends React.Component {
  componentDidUpdate(prevProps, nextProps) {
    if (prevProps !== nextProps && this.props.generalErrorMessage) {
      this.toast.show(
        this.props.generalErrorMessage,
        this.props.errorMessageVisibleTime
      );
      this.props.clearGeneralErrorMessage();
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
      <View style={styles.container}>
        <Toast
          ref={(toast) => (this.toast = toast)}
          style={{ backgroundColor: colors.danger }}
          position="top"
          positionValue={0}
          fadeInDuration={200}
          fadeOutDuration={200}
          textStyle={{ color: colors.white }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  generalErrorMessage: state.entities.general.errorMessage,
  usersErrorMessage: state.entities.users.errorMessage,
  roomsErrorMessage: state.entities.rooms.errorMessage,
  errorMessageVisibleTime: state.entities.general.errorMessageVisibleTime,
});

const mapDispatchToProps = (dispatch) => ({
  clearGeneralErrorMessage: () => dispatch(errorMessageCleared()),
  clearUsersErrorMessage: () => dispatch(usersErrorMessageCleared()),
  clearRoomsErrorMessage: () => dispatch(roomsErrorMessageCleared()),
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 100,
    width: "100%",
    marginTop: Constants.statusBarHeight,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(AppErrorToast);
