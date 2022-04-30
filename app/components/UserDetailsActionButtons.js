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
import AppButton from "./AppButton";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import EditUserModal from "./modals/EditUserModal";

const USER_ACTIONS = {
  deleted: {
    taskType: taskTypes.userDeleted,
    questionTitle: appMessages.questions.deleteUser.title,
    questionBody: appMessages.questions.deleteUser.body,
    successMessage: appMessages.questions.deleteUser.success,
  },
  archived: {
    taskType: taskTypes.userArchived,
    questionTitle: appMessages.questions.archiveUser.title,
    questionBody: appMessages.questions.archiveUser.body,
    successMessage: appMessages.questions.archiveUser.success,
  },
  activateUser: {
    taskType: taskTypes.userActivated,
    questionTitle: appMessages.questions.activateUser.title,
    questionBody: appMessages.questions.archiveUser.body,
    successMessage: appMessages.questions.activateUser.success,
  },
};

function UserDetailsActionButtons({ userId }) {
  const dispatch = useDispatch();
  const store = useStore();

  const userData = useSelector(selectUserById(userId));
  const currentUserId = selectCurrentUserId(store);

  const onDeleteUser = async () => {
    handleUserState("deleted");
  };

  const archiveUser = async () => {
    handleUserState("archived");
  };

  const activateUser = async () => {
    handleUserState("activateUser");
  };

  const handleUserState = async (action) => {
    const result = await confirmAlert(
      USER_ACTIONS[action].questionTitle,
      USER_ACTIONS[action].questionBody
    );

    if (!result) return;

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
            {userData.status === "archived" ? (
              <AppButton
                title={"activate user"}
                color="white"
                backgroundColor="green"
                onPress={activateUser}
              />
            ) : (
              <AppButton
                title={"archive user"}
                color="black"
                backgroundColor="khaki"
                onPress={archiveUser}
              />
            )}
          </View>
          <View style={styles.buttonRow}>
            <AppButton
              title={"delete user"}
              color="white"
              backgroundColor="danger"
              onPress={onDeleteUser}
            />
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
