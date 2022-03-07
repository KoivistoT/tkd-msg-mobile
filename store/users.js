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

    myTestArray: [
      { a: 1, text: "eka" },
      { a: 1, text: "toinen" },
    ],
  },
  reducers: {
    // action => action handler
    usersResived: (users, action) => {
      // console.log("users resived");
      users.allUsers = action.payload;
      // alert(Object.keys(users.allUsers).length, "monta käyttäjää tulee");
      // console.log(
      //   "users resived",
      //   users.allUsers["61e6a7f6b30d002e91d67b50"].email
      // );
    },
    userActivated: (users, action) => {
      users.allUsers[action.payload].status = "active";
    },
    itemAdded: (users, action) => {
      users.myTestArray[0].a = 2 * users.myTestArray[0].a;
      // console.log(users.myTestArray);
    },
    newUserResived: (users, action) => {
      Object.assign(users.allUsers, action.payload);
    },
    userDeleted: (users, action) => {
      delete users.allUsers[action.payload];
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
      users.allUsers[action.payload._id] = action.payload.newUserData;
      // }
    },
    requestSuccess: (users, action) => {
      users.loading = false;
    },
    userArchived: (users, action) => {
      users.allUsers[action.payload].status = "archived";
    },
    userTemporaryDeleted: (users, action) => {
      users.allUsers[action.payload].status = "deleted";
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
  },
});

export const {
  usersResived,
  usersError,
  userCreated,
  newUserResived,
  userDeleted,
  channelsResived,
  userActivated,
  usersErrorCleared,
  userDataEdited,
  requestSuccess,
  userTemporaryDeleted,
  userArchived,
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

export const getUsersById = (userId) =>
  createSelector(
    (state) => state.entities.users,
    (users) => users.allUsers[userId]
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

export const selectAllUsers = createSelector(
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

export const selectAllUsers2 = memoize((state) => {
  console.log("laskee ekassa -4-4--4--4--4-4--4-4-4");
  return Object.values(state.entities.users.allUsers).reduce(
    (newObject, item) => {
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
          userRooms: [...userRooms],
        },
      });
    },
    {}
  );
});

export const selectAllUsers1 = memoize((state) => {
  console.log("laskee ekassa 1111111");
  console.log("computingcomputingcomputingcomputingcomputingcomputing");
  return Object.values(state.entities.users.allUsers).map((item) => {
    const {
      firstName,
      _id,
      accountType,
      is_active,
      email,
      phone,
      status,
      userRooms,
    } = item;
    return {
      [_id]: {
        firstName,
        _id,
        accountType,
        is_active,
        email,
        phone,
        status,
        userRooms: [...userRooms],
      },
    };
  });
});
