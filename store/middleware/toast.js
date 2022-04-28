const toast =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    switch (action.type) {
      default:
        next(action);
        break;
    }
  };

export default toast;
