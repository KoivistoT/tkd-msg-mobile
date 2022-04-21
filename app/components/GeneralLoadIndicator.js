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
import AppText from "./AppText";

class GeneralLoadIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showIndicator: false };
  }

  componentDidUpdate(prevProps) {
    if (this.props.loading !== prevProps.loading) {
      if (this.props.loading === false) {
        setTimeout(() => {
          this.setState({ showIndicator: this.props.loading });
        }, 200);
      } else {
        this.setState({ showIndicator: this.props.loading });
      }
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
              justifyContent: "center",
              flex: 1,
              zIndex: 100,
              width: "100%",
              height: "100%",
              //   opacity: 0.9,
              backgroundColor: colors.white,
              marginTop: Constants.statusBarHeight,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <AppText style={{ margin: 20, color: colors.primary }}>
                Uploading image(s)/document
              </AppText>
              <ActivityIndicator
                animating={true}
                size="large"
                style={{
                  opacity: 1,
                  //   backgroundColor: colors.primary,
                  width: "100%",
                  //   height: 80,
                  //   borderRadius: 20,

                  padding: 5,
                  alignSelf: "center",
                }}
                color={colors.primary}
              />
            </View>
          </View>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.entities.general.loading, //onko oikein
});

const mapDispatchToProps = (dispatch) => ({
  //   loading: () => dispatch(errorMessageCleared()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneralLoadIndicator);
