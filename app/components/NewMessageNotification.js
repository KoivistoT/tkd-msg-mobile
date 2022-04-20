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
import { errorMessageCleared, newMessageCleared } from "../../store/general";
import AppText from "./AppText";
import { navigationRef } from "../navigation/rootNavigation";
import routes from "../navigation/routes";
import userFuncs from "../../utility/userFuncs";
import roomFuncs from "../../utility/roomFuncs";

class GeneralLoadIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showMessage: false };
  }

  componentDidUpdate(prevProps) {
    if (this.props.newMessage === null) return;
    if (!this.props.newMessage.roomId) return;
    if (!this.props.allRoomData[this.props.newMessage.roomId]) return;

    if (
      this.props.newMessage &&
      this.props.newMessage !== prevProps.newMessage
    ) {
      this.setState({ showMessage: true });
      setTimeout(() => {
        this.setState({ showMessage: false });
      }, 2000);
    }
  }

  render() {
    // const { roomId, postedByUser, type, messageBody } = this.props.newMessage;
    const getRoomData = () => {
      const roomData = store.getState().entities.rooms.allRooms[currentRoomId];
    };
    const goToRoom = () => {
      this.state.showMessage = false;
      navigationRef.current.navigate(
        routes.MESSAGE_SCREEN,
        this.props.allRoomData[this.props.newMessage.roomId]
      );
      this.props.clear();
    };

    return (
      <>
        {this.state.showMessage && (
          <TouchableOpacity
            style={{
              // position: "absolute",
              // alignSelf: "center",
              // justifyContent: "center",
              // flex: 1,
              // zIndex: 100,
              // width: "100%",
              // height: "100%",
              // //   opacity: 0.9,
              // backgroundColor: colors.white,
              // marginTop: Constants.statusBarHeight,
              position: "absolute",
              alignSelf: "center",

              backgroundColor: colors.primary,
              zIndex: 100,
              top: 0,
              paddingHorizontal: 20,
              paddingTop: Constants.statusBarHeight,
              paddingBottom: 10,
              width: "100%",
              // height: Constants.statusBarHeight * 3,
            }}
            activeOpacity={1}
            onPress={() => goToRoom()}
          >
            {/* <View style={{ alignItems: "center" }}> */}
            {this.props.allRoomData[this.props.newMessage.roomId] &&
              this.props.allRoomData[this.props.newMessage.roomId].type !==
                "private" && (
                <AppText
                  numberOfLines={1}
                  style={{
                    alignSelf: "center",
                    overflow: "hidden",
                    color: colors.white,
                  }}
                >
                  {roomFuncs.getRoomTitle(
                    this.props.allRoomData[this.props.newMessage.roomId],
                    this.props.allUserData,
                    this.props.currentUserId
                  )}
                </AppText>
              )}
            <AppText style={{ alignSelf: "center", color: colors.white }}>
              {userFuncs.getFullName(
                this.props.allUserData,
                this.props.newMessage.postedByUser
              )}
            </AppText>
            <AppText
              numberOfLines={1}
              style={{
                alignSelf: "center",
                overflow: "hidden",
                color: colors.white,
              }}
            >
              {this.props.newMessage.messageBody !== ""
                ? `New message: ${this.props.newMessage.messageBody}`
                : `New ${this.props.newMessage.type}`}
            </AppText>
            {/* </View> */}
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneralLoadIndicator);
