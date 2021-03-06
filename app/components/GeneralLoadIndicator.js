import React from "react";
import { View, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { connect } from "react-redux";
import Constants from "expo-constants";
import colors from "../../config/colors";
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
          <View style={styles.container}>
            <AppText style={styles.text}>{this.props.loadingMessage}</AppText>
            <ActivityIndicator
              animating={true}
              size="large"
              style={styles.activityIndicator}
              color={colors.primary}
            />
          </View>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.entities.general.loading,
  loadingMessage: state.entities.general.loadingMessage,
});

const styles = StyleSheet.create({
  activityIndicator: {
    opacity: 1,
    width: "100%",
    padding: 5,
    alignSelf: "center",
  },
  container: {
    container: {
      alignItems: "center",
      position: Platform.OS == "ios" ? "absolute" : "relative",
      alignSelf: "center",
      justifyContent: "center",
      zIndex: 2,
      width: "100%",
      height: "100%",
      backgroundColor: colors.white,
    },
  },
  text: { margin: 20, color: colors.primary },
});
export default connect(mapStateToProps)(GeneralLoadIndicator);
