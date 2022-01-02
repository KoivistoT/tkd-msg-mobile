const toast = (store) => (next) => (action) => {
  // console.log(action);
  // if (action.type === "api/callFailed") {
  //   console.log(
  //     "tee tämä appToastifyllä tai jotenkin hyvin. tämä siis silloin jos ip väärin, eli network error. etenkin silloi"
  //   );
  //   console.log("Toastify:", action.payload);
  // } else return next(action);
  return next(action);
};

export default toast;
