import React from "react";
import { View, StyleSheet } from "react-native";
import Toast from "react-native-easy-toast";
import { connect } from "react-redux";
import Constants from "expo-constants";
import colors from "../../config/colors";
import { successMessageCleared } from "../../store/general";

class AppSuccessToast extends React.Component {
  componentDidUpdate(prevProps, nextProps) {
    if (prevProps !== nextProps && this.props.successMessage) {
      this.toast.show(
        this.props.successMessage,
        this.props.successMessageVisibleTime
      );
      setTimeout(() => {
        this.props.clearSuccessMessage();
      }, this.props.successMessageVisibleTime);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Toast
          ref={(toast) => (this.toast = toast)}
          style={styles.toast}
          position="top"
          positionValue={0}
          fadeInDuration={200}
          fadeOutDuration={200}
          textStyle={styles.text}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  successMessage: state.entities.general.successMessage,
  successMessageVisibleTime: state.entities.general.successMessageVisibleTime,
});

const mapDispatchToProps = (dispatch) => ({
  clearSuccessMessage: () => dispatch(successMessageCleared()),
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 100,
    width: "100%",
    marginTop: Constants.statusBarHeight * 2,
  },
  toast: {
    backgroundColor: colors.success,
  },
  text: { color: colors.white },
});
export default connect(mapStateToProps, mapDispatchToProps)(AppSuccessToast);
