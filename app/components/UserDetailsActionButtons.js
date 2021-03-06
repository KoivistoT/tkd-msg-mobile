import React from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import appMessages from "../../config/appMessages";
import taskTypes from "../../config/taskTypes";
import { selectCurrentUserId } from "../../store/currentUser";
import { successMessageAdded } from "../../store/general";
import {
  activateUserById,
  archiveOrDeleteUserById,
  selectUserById,
  userTasksResived,
} from "../../store/users";
import confirmAlert from "../../utility/confirmAlert";
import createTask from "../../utility/createTask";
import { navigationRef } from "../navigation/rootNavigation";
import AppButton from "./AppButton";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import EditUserModal from "./modals/EditUserModal";

const USER_ACTIONS = {
  deleted: {
    taskType: taskTypes.userDeleted,
    questionTitle: appMessages.questions.DELETE_USER.title,
    questionBody: appMessages.questions.DELETE_USER.body,
    successMessage: appMessages.questions.DELETE_USER.success,
  },
  archived: {
    taskType: taskTypes.userArchived,
    questionTitle: appMessages.questions.ARCHIVE_USER.title,
    questionBody: appMessages.questions.ARCHIVE_USER.body,
    successMessage: appMessages.questions.ARCHIVE_USER.success,
  },
  activateUser: {
    taskType: taskTypes.userActivated,
    questionTitle: appMessages.questions.ACTIVATE_USER.title,
    questionBody: appMessages.questions.ACTIVATE_USER.body,
    successMessage: appMessages.questions.ACTIVATE_USER.success,
  },
};

function UserDetailsActionButtons({ userId }) {
  const dispatch = useDispatch();
  const store = useStore();

  const userData = useSelector(selectUserById(userId));
  const currentUserId = selectCurrentUserId(store);

  const onDeleteUser = () => {
    handleUserState("deleted");
  };

  const archiveUser = () => {
    handleUserState("archived");
  };

  const activateUser = () => {
    handleUserState("activateUser");
  };

  const handleUserState = async (action) => {
    const result = await confirmAlert(
      USER_ACTIONS[action].questionTitle,
      USER_ACTIONS[action].questionBody
    );

    if (!result) {
      return;
    }

    const newTask = createTask(USER_ACTIONS[action].taskType, userId);
    dispatch(userTasksResived(newTask));

    if (action === "activateUser") {
      dispatch(activateUserById(userId, action, currentUserId));
    }
    if (action === "archived") {
      dispatch(archiveOrDeleteUserById(userId, action, currentUserId));
    }
    if (action === "deleted") {
      dispatch(archiveOrDeleteUserById(userId, action, currentUserId));
      navigationRef.current.goBack();
    }

    dispatch(successMessageAdded(USER_ACTIONS[action].successMessage));
  };

  return (
    <>
      {userData && (
        <>
          <View style={styles.buttonRow}>
            <EditUserModal userId={userData._id} />
            {currentUserId !== userId && userData.status && (
              <>
                {userData.status === "archived" && (
                  <AppButton
                    title={"Activate user"}
                    color="white"
                    backgroundColor="green"
                    onPress={activateUser}
                  />
                )}
                {userData.status === "active" && (
                  <AppButton
                    title={"Archive user"}
                    color="black"
                    backgroundColor="khaki"
                    onPress={archiveUser}
                  />
                )}
              </>
            )}
          </View>
          <View style={[styles.buttonRow, { marginBottom: 30 }]}>
            {currentUserId !== userId && (
              <AppButton
                title={"Delete user"}
                color="white"
                backgroundColor="danger"
                onPress={onDeleteUser}
              />
            )}
            <ChangePasswordModal
              userName={userData.email}
              requireCurrentPassword={false}
            />
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  buttonRow: { flexDirection: "row", alignSelf: "center" },
});

export default UserDetailsActionButtons;
