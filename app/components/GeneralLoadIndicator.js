import React from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Toast, { DURATION } from "react-native-easy-toast";
import { connect } from "react-redux";
import Constants from "expo-constants";
import colors from "../../config/colors";
import { errorMessageCleared } from "../../store/general";

class GeneralLoadIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showIndicator: false };
  }

  componentDidUpdate(prevProps) {
    if (this.props.loading !== prevProps.loading) {
      this.setState({ showIndicator: this.props.loading });
    }
  }

  render() {
    return (
      <>
        {this.state.showIndicator && (
          <View
            style={{
              position: "absolute",
              alignSelf: "center",
              //   justifyContent: "center",
              //   flex: 1,
              zIndex: 100,
              width: "100%",
              height: "100%",

              marginTop: Constants.statusBarHeight,
            }}
          >
            <View>
              <ActivityIndicator
                animating={true}
                size="large"
                style={{
                  opacity: 1,
                  backgroundColor: colors.primary,
                  width: "100%",
                  //   height: 80,
                  //   borderRadius: 20,
                  padding: 5,
                  alignSelf: "center",
                }}
                color={colors.secondary}
              />
            </View>
          </View>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.entities.rooms.loading,
});

const mapDispatchToProps = (dispatch) => ({
  //   loading: () => dispatch(errorMessageCleared()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneralLoadIndicator);
