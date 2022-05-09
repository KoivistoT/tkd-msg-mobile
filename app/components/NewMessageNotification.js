import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Constants from "expo-constants";
import colors from "../../config/colors";
import { newMessageCleared } from "../../store/general";
import AppText from "./AppText";
import { navigate } from "../navigation/rootNavigation";
import routes from "../navigation/routes";
import userFuncs from "../../utility/userFuncs";
import roomFuncs from "../../utility/roomFuncs";

class GeneralLoadIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showMessage: false, counter: 0 };
  }

  componentDidUpdate(prevProps) {
    if (this.props.newMessage === null) {
      return;
    }
    if (!this.props.newMessage.roomId) {
      return;
    }
    if (!this.props.allRoomData[this.props.newMessage.roomId]) {
      return;
    }

    if (
      this.props.newMessage &&
      this.props.newMessage !== prevProps.newMessage &&
      this.props.newMessage.postedByUser !== this.props.currentUserId
    ) {
      this.setState({ showMessage: true });

      this.setState({ counter: this.state.counter + 1 });
      setTimeout(() => {
        this.setState({ counter: this.state.counter - 1 });
        if (this.state.counter === 0) {
          this.setState({ showMessage: false });
        }
      }, 3000);
    }
  }

  render() {
    const goToRoom = () => {
      this.state.showMessage = false;
      navigate(
        routes.MESSAGE_SCREEN,
        this.props.allRoomData[this.props.newMessage.roomId]
      );
      this.props.clear();
    };

    return (
      <>
        {this.state.showMessage && (
          <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={() => goToRoom()}
          >
            {this.props.allRoomData[this.props.newMessage.roomId] &&
              this.props.allRoomData[this.props.newMessage.roomId].type !==
                "private" && (
                <AppText numberOfLines={1} style={styles.text}>
                  {roomFuncs.getRoomTitle(
                    this.props.allRoomData[this.props.newMessage.roomId],
                    this.props.allUserData,
                    this.props.currentUserId
                  )}
                </AppText>
              )}
            <AppText style={styles.name}>
              {userFuncs.getFullName(
                this.props.allUserData,
                this.props.newMessage.postedByUser
              )}
            </AppText>
            <AppText numberOfLines={1} style={styles.body}>
              {this.props.newMessage.messageBody !== ""
                ? `New message: ${this.props.newMessage.messageBody}`
                : `New ${this.props.newMessage.type}`}
            </AppText>
          </TouchableOpacity>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  newMessage: state.entities.general.newMessage,
  allRoomData: state.entities.rooms.allRooms,
  allUserData: state.entities.users.allUsers,
  currentUserId: state.auth.currentUser._id,
});

const mapDispatchToProps = (dispatch) => ({
  clear: () => dispatch(newMessageCleared()),
});

const styles = StyleSheet.create({
  body: {
    alignSelf: "center",
    overflow: "hidden",
    color: colors.white,
  },
  container: {
    position: Platform.OS == "ios" ? "absolute" : "relative",
    alignSelf: "center",
    backgroundColor: colors.primary,
    zIndex: 100,
    top: 0,
    paddingHorizontal: 20,
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 10,
    width: "100%",
  },
  name: { alignSelf: "center", color: colors.white },
  text: {
    alignSelf: "center",
    overflow: "hidden",
    color: colors.white,
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneralLoadIndicator);
