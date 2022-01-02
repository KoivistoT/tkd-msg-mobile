import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./actions";
import moment from "moment";

const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },

    bugsRequestFaild: (bugs, actions) => {
      bugs.loading = false;
    },
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
    bugRemoved: (bugs, action) => {
      bugs.list.filter((bug) => bug.id !== action.payload.id);
    },
    bugAssignedToUser: (bugs, action) => {
      const { id: bugId, userId } = action.payload;
      const index = bugs.list.findIndex((bug) => bug.id === bugId);
      bugs.list[index].userId = userId;
    },
  },
});

export const {
  bugAdded,
  bugsRequested,
  bugRemoved,
  bugResolved,
  bugsReceived,
  bugAssignedToUser,
  bugsRequestFaild,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/bugs";

export const loadBugs = () => (dispatch, getState) => {
  // const { lastFetch } = getState().entities.bugs;

  // const diffMinutes = moment().diff(moment(lastFetch), "minutes");
  // if (diffMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
      onError: bugsRequestFaild.type,
    })
  );
};
export const addBug = (bug) =>
  apiCallBegan({
    url,
    method: "post",
    data: bug,
    onSuccess: bugAdded.type,
  });

export const assingBugToUser = (bugId, userId) =>
  apiCallBegan({
    url: url + "/" + bugId,
    method: "patch",
    data: { userId },
    onSuccess: bugAssignedToUser.type,
  });

export const resolveBug = (id) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "patch",
    data: { resloved: true },
    onSuccess: bugResolved.type,
  });

// Selector
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs, // tämä eka menee tuohon toiseen, eli tässä otetaan bugs
  (state) => state.entities.projects,
  (bugs, projects) => bugs.list.filter((bug) => !bug.resolved) // jos bugs tai projects ei muutu,
  // tulee cachesta tulos, jos tämän toisen kerran kutsuu, eli ei tule turhaa rerenderiä. object, eli tulos,
  //kun menee aina eri muistiin
  // voit kekeilla tätä indexissä kutsumalla ensin a = getunsolve... ja sitten b= getunsolve...
  // jos a===b on false, jokin on muuttunut. jos ei käytä selectoria, niin sitten tulee aina false
);

export const getBugs = createSelector(
  (state) => state.entities.bugs.list, // tämä eka menee tuohon toiseen, eli tässä otetaan bugs

  (bugs) => bugs // jos bugs tai projects ei muutu,
  // tulee cachesta tulos, jos tämän toisen kerran kutsuu, eli ei tule turhaa rerenderiä. object, eli tulos,
  //kun menee aina eri muistiin
  // voit kekeilla tätä indexissä kutsumalla ensin a = getunsolve... ja sitten b= getunsolve...
  // jos a===b on false, jokin on muuttunut. jos ei käytä selectoria, niin sitten tulee aina false
);

export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.filter((bug) => bug.userId === userId)
  );
