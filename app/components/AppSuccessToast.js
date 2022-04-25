import React from "react";
import { View } from "react-native";
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
          style={{
            backgroundColor: colors.success,
            height: 40,
          }}
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
  successMessage: state.entities.general.successMessage,
  successMessageVisibleTime: state.entities.general.successMessageVisibleTime,
});

const mapDispatchToProps = (dispatch) => ({
  clearSuccessMessage: () => dispatch(successMessageCleared()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AppSuccessToast);
