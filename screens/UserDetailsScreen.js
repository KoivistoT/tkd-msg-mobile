import React from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppButton from "../app/components/AppButton";
import UserInfoCard from "../app/components/UserInfoCard";
import EditUserModal from "../app/components/modals/EditUserModal";
import { navigationRef } from "../app/navigation/rootNavigation";
import {
  selectUserById,
  activateUserById,
  archiveOrDeleteUserById,
  userTasksResived,
} from "../store/users";
import confirmAlert from "../utility/confirmAlert";
import ChangePasswordModal from "../app/components/modals/ChangePasswordModal";
import { selectCurrentUserId } from "../store/currentUser";
import createTask from "../utility/createTask";
import { successMessageAdded } from "../store/general";

const USER_ACTIONS = {
  delete: {
    taskName: "userDeleted",
    questionTitle: "Haluatko poistaa käyttäjän",
    questionBody: "",
    successMessage: "User deleted",
  },
  archived: {
    taskName: "userArchived",
    questionTitle: "Haluatko arkistoida käyttäjän?",
    questionBody: "",
    successMessage: "User archived",
  },
  activateUser: {
    taskName: "userActivated",
    questionTitle: "Haluatko aktivoida käyttäjän?",
    questionBody: "",
    successMessage: "User activated",
  },
};

function UserDetailsScreen(item) {
  const dispatch = useDispatch();

  const userId = item.route.params._id;

  const userData = useSelector(selectUserById(userId));
  const store = useStore();
  const currentUserId = selectCurrentUserId(store);

  const onDeleteUser = async () => {
    handleUserState("deleted");
    navigationRef.current.goBack();
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
    console.log(result, "tässä result");
    if (!result) return;

    const newTask = createTask(USER_ACTIONS[action].taskName, userId);
    dispatch(userTasksResived(newTask));

    action === "activateUser"
      ? dispatch(activateUserById(userId, action, currentUserId))
      : dispatch(archiveOrDeleteUserById(userId, action, currentUserId));

    dispatch(successMessageAdded(USER_ACTIONS[action].successMessage));
  };

  return (
    <View style={styles.container}>
      {userData && (
        <View style={{ padding: 20 }}>
          <UserInfoCard userId={userId} />

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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  buttonRow: { flexDirection: "row", alignSelf: "center" },
});
export default UserDetailsScreen;
