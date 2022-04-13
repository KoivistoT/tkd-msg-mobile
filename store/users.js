import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiCallBegan } from "./actions";
import settings from "../config/settings";
import {
  createSelector as memoCreateSelector,
  createSelectorCreator,
  defaultMemoize,
} from "reselect";
import isEqual from "lodash.isequal";
import memoize from "proxy-memoize";
const slice = createSlice({
  name: "users",
  initialState: {
    allUsers: {}, //nämä voi olla kai objecteja, myös muualla ?
    usersOnline: {},
    allUsersId: [],
    myTestArray: [
      { a: 1, text: "eka" },
      { a: 1, text: "toinen" },
    ],
  },
  reducers: {
    // action => action handler
    usersResived: (users, action) => {
      // console.log("users resived", action.payload);
      users.allUsers = action.payload;
      users.allUsersId = Object.keys(action.payload);

      // alert(Object.keys(users.allUsers).length, "monta käyttäjää tulee");
      // console.log(
      //   "users resived",
      //   users.allUsers["61e6a7f6b30d002e91d67b50"].email
      // );
    },

    usersOnlineResived: (users, action) => {
      users.usersOnline = action.payload;
      // console.log(users.myTestArray);
    },
    itemAdded: (users, action) => {
      users.myTestArray[0].a = 2 * users.myTestArray[0].a;
      // console.log(users.myTestArray);
    },

    userCreated: (users, action) => {
      console.log(action.payload, "User lisätty");
    },
    userDataEdited: (users, action) => {
      // console.log(
      //   "tässä tämä tieti---------------------------------------",
      //   deepEqual(
      //     users.allUsers[action.payload._id],
      //     action.payload.newUserData
      //   )
      // );
      // if (
      //   deepEqual(
      //     users.allUsers[action.payload._id],
      //     action.payload.newUserData
      //   )
      // ) {
      //   console.log("ovat samoja ei päivitä");
      //   return;
      // } else {
      //   console.log("eivät ole samoja");
      // }
    },
    requestSuccess: (users, action) => {
      users.loading = false;
    },
    userTasksResived: (users, action) => {
      let newState = { ...users };

      action.payload.forEach((task) => {
        const { taskType, data } = task;

        if (taskType === "userArchived") {
          const userId = data;
          newState.allUsers[userId].status = "archived";
        }
        if (taskType === "userActivated") {
          const userId = data;
          newState.allUsers[userId].status = "active";
        }
        if (taskType === "newUser") {
          const { _id: userId } = data;
          Object.assign(newState.allUsers, { [userId]: data });
        }
        if (taskType === "userDeleted") {
          // tätä ei kaiketi enää käytetä
          const userId = data;
          delete newState.allUsers[userId];
        }
        if (taskType === "userTemporaryDeleted") {
          const userId = data;
          newState.allUsers[userId].status = "deleted";
        }
        if (taskType === "userDataEdited") {
          const { _id: userId } = data;
          newState.allUsers[userId] = data;
        }
      });
      users = newState;
    },

    usersError: (users, action) => {
      users.errorMessage = action.payload;

      console.log(action.payload, "epännoistu appcode 1233322");
    },
    usersErrorCleared: (users, action) => {
      users.errorMessage = null;
    },
    channelsResived: (users, action) => {
      users.allChannels = action.payload;
    },
    userLastPresentResived: (users, action) => {
      const { userId, last_present } = action.payload;
      users.allUsers[userId].last_present = last_present;
    },
  },
});

export const {
  usersResived,
  usersError,
  userCreated,
  usersOnlineResived,
  userLastPresentResived,
  channelsResived,

  usersErrorCleared,

  requestSuccess,

  userTasksResived,
  itemAdded,
} = slice.actions;
export default slice.reducer;

function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (key === "updatedAt") continue;
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }
  return true;
}
function isObject(object) {
  return object != null && typeof object === "object";
}

const url = settings.apiUrl + "/users";

export const getAllUsers = () =>
  apiCallBegan({
    url: url + "/all",
    onSuccess: usersResived.type,
    onError: usersError.type,
  });

export const getAllChannels = () =>
  apiCallBegan({
    url: settings.apiUrl + "/rooms/all_channels",
    onSuccess: channelsResived.type,
    onError: usersError.type,
  });

export const archiveOrDeleteUserById = (userId, status) =>
  apiCallBegan({
    url: url + "/archive_or_delete_user",
    method: "post",
    data: {
      userId,
      status,
    },
    // onSuccess: userControlUserDeleted.type,
    onError: usersError.type,
  });
export const getUserLastPresentByUserId = (userId) =>
  apiCallBegan({
    url: url + "/get_last_user_last_present",
    method: "post",
    data: {
      userId,
    },
    onSuccess: userLastPresentResived.type,
    onError: usersError.type,
  });

export const createUser = (
  password,
  accountType,
  firstName,
  lastName,
  displayName,
  email,
  phone,
  status = "active"
) =>
  apiCallBegan({
    url: url + "/create_user",
    method: "post",
    data: {
      password,
      accountType,
      firstName,
      lastName,
      displayName,
      email,
      phone,
      status,
    },
    onSuccess: requestSuccess.type,
    onError: usersError.type,
  });
export const editUserData = (
  accountType,
  displayName,
  firstName,
  lastName,
  email,
  phone,
  userId
) =>
  apiCallBegan({
    url: url + "/edit_user_data",
    method: "post",
    data: {
      accountType,
      displayName,
      firstName,
      lastName,
      email,
      phone,
      userId,
    },
    onSuccess: requestSuccess.type,
    onError: usersError.type,
  });

export const activateUserById = (userId) =>
  apiCallBegan({
    url: url + "/activate_user/" + userId,
    onSuccess: requestSuccess.type,
    onError: usersError.type,
  });

export const selectUserById = (userId) =>
  createSelector(
    (state) => state.entities.users,
    (users) => users.allUsers[userId]
  );

export const selectLastPresentByUserId = (userId) =>
  createSelector(
    (state) => state.entities.users,
    (users) => users.allUsers[userId].last_present
  );

export const selectUsersOnline = createSelector(
  (state) => state.entities.users,
  (users) => users.usersOnline
);

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

// export const selectMyItems = createSelector(
//   (state) => state.entities.users,
//   (users) => {
//     console.log("computingcomputingcomputingcomputingcomputingcomputing");
//     return users.myTestArray.map((todo) => todo.text);
//   }
// );
export const selectMyItems = memoize((state) => {
  console.log("computingcomputingcomputingcomputingcomputingcomputing");
  return state.entities.users.myTestArray.reduce((a, b) => {
    return a > b ? a : b;
  });
});
// export const selectMyItems = memoize((state) => {
//   console.log("computingcomputingcomputingcomputingcomputingcomputing");
//   return state.entities.users.myTestArray.map((todo) => todo.text);
// });

export const selectUserRoomsAndAllUsers = memoize(
  // (state) => state.entities.users.allUsers,
  // (state) => state.entities.rooms.allRooms,
  (state) => {
    console.log("tässä ekassa laskee");
    const objects = Object.values(state.entities.users.allUsers).reduce(
      (newObject, item) => {
        console.log("tässä tokassa laskee");
        const {
          _id,
          firstName,
          lastName,
          accountType,
          displayName,
          email,
          phone,
          status,
          userRooms,
        } = item;
        return Object.assign(newObject, {
          [_id]: {
            _id,
            firstName,
            lastName,
            accountType,
            displayName,
            email,
            phone,
            status,
            userRooms,
          },
        });
      },
      {}
    );

    return Object.keys(objects).length > 0
      ? { allUsers: objects, userRooms: state.entities.rooms.allRooms }
      : { allUsers: null, userRooms: null };
  }
);

// export const selectUserRoomsAndAllUsers = createDeepEqualSelector(
//   (state) => state.entities.users.allUsers,
//   (state) => state.entities.rooms.allRooms,
//   (allUsers, userRooms) => {
//     console.log("tässä ekassa laskee");
//     const objects = Object.values(allUsers).reduce((newObject, item) => {
//       console.log("tässä tokassa laskee");
//       const {
//         _id,
//         firstName,

//         accountType,
//         displayName,
//         email,
//         phone,
//         status,
//         userRooms,
//       } = item;
//       return Object.assign(newObject, {
//         [_id]: {
//           _id,
//           firstName,

//           accountType,
//           displayName,
//           email,
//           phone,
//           status,
//           userRooms,
//         },
//       });
//     }, {});

//     return Object.keys(objects).length > 0
//       ? { allUsers: objects, userRooms }
//       : { allUsers: null, userRooms: null };
//   }
// );

export const selectAllUsers2 = createSelector(
  (state) => state.entities.users,
  (users) => {
    const objects = Object.values(users.allUsers).reduce((newObject, item) => {
      const {
        _id,
        firstName,

        accountType,
        displayName,
        email,
        phone,
        status,
        userRooms,
      } = item;
      return Object.assign(newObject, {
        [_id]: {
          _id,
          firstName,

          accountType,
          displayName,
          email,
          phone,
          status,
          userRooms,
        },
      });
    }, {});

    return Object.keys(objects).length > 0 ? objects : null;
  }
);

export const selectAllUsersAllData = memoize((state) => {
  // console.log("laskee ekassa -4-4--4--4--4-4--4-4-4");
  return Object.values(state.entities.users.allUsers).reduce(
    (newObject, item) => {
      const {
        _id,
        firstName,
        lastName,
        accountType,
        displayName,
        email,
        phone,
        status,
        userRooms,
      } = item;
      return Object.assign(newObject, {
        [_id]: {
          _id,
          firstName,
          lastName,
          accountType,
          displayName,
          email,
          phone,
          status,
          userRooms: userRooms ? [...userRooms] : null,
        },
      });
    },
    {}
  );
});

export const selectAllUsersMinimal = memoize((state) => {
  // console.log("laskee ekassa 1111111");
  // console.log("computingcomputingcomputingcomputingcomputingcomputing");
  // console.log("laskee ekassa -4-4--4--4--4-4--4-4-4");
  return Object.values(state.entities.users.allUsers).reduce(
    (newObject, item) => {
      const { _id, firstName, lastName, displayName } = item;
      return Object.assign(newObject, {
        [_id]: {
          _id,
          firstName,
          lastName,
          displayName,
        },
      });
    },
    {}
  );
});

export const selectAllUsersMedium = memoize((state) => {
  // console.log("laskee ekassa 1111111");
  // console.log("computingcomputingcomputingcomputingcomputingcomputing");
  // console.log("laskee ekassa -4-4--4--4--4-4--4-4-4");
  return Object.values(state.entities.users.allUsers).reduce(
    (newObject, item) => {
      const { _id, firstName, lastName, displayName, status } = item;
      return Object.assign(newObject, {
        [_id]: {
          _id,
          firstName,
          lastName,
          displayName,
          status,
        },
      });
    },
    {}
  );
});

// const heavyComputation = (state, idArray) => {
//   return idArray.reduce((newObject, _id) => {
//     return Object.assign(newObject, {
//       [_id]: state.entities.users.allUsers[_id],
//     });
//   }, {});
// };
// const getUsers = memoize((state) => ({
//   selectedUsers: heavyComputation(state.a + state.b),
// }));

// export const selectMultipleUsersById2 = (state, idArray) => ({
//   selectedUsers: heavyComputation(state, idArray),
// });
export const selectMultipleUsersById2 = memoize((argument) => {
  return argument.idArray.reduce((newObject, _id) => {
    return Object.assign(newObject, {
      [_id]: {
        _id: argument.state.entities.users.allUsers[_id]._id,
        firstName: argument.state.entities.users.allUsers[_id].firstName,
        lastName: argument.state.entities.users.allUsers[_id].lastName,
        // displayName: argument.state.entities.users.allUsers[_id].displayName,
      },
    });
  }, {});
});

export const selectMultipleUsersById = (idArray) =>
  createSelector(
    (state) => state.entities.users,
    (users) => {
      return idArray.reduce((newObject, _id) => {
        return Object.assign(newObject, {
          [_id]: {
            _id: users.allUsers[_id]._id,
            firstName: users.allUsers[_id].firstName,
            lastName: users.allUsers[_id].lastName,
            displayName: users.allUsers[_id].displayName,
          },
        });
      }, {});
    }
  );
export const selectWithArray = (idArray) =>
  memoCreateSelector(
    (state) => state.entities.users,
    (users) => {
      console.log("kdsjfkjsdklfjlsfjsdklfjlksdjfklsjdf");
      return Object.keys(users.allUsers).map((userId) => {
        if (idArray.includes(userId)) {
          return {
            [users.allUsers[userId]._id]: {
              _id: users.allUsers[userId]._id,
              firstName: users.allUsers[userId].firstName,
              lastName: users.allUsers[userId].lastName,
              displayName: users.allUsers[userId].displayName,
            },
          };
        }
        return null;
      });
    }
  );
