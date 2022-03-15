import React, { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  bucketCleared,
  clearBucket,
  selectChangeBucket,
} from "../../store/currentUser";
import { newMessageResived } from "../../store/msgStore";
import { roomLatestMessageChanged } from "../../store/rooms";

function DispatchHandler() {
  const changeBucket = useSelector(selectChangeBucket);
  const dispatch = useDispatch();
  const store = useStore();

  const currentUserId = store.getState().auth.currentUser._id;
  useEffect(() => {
    if (changeBucket && changeBucket.length !== 0) {
      //   dispatch(clearBucket(currentUserId));
      changeBucket.forEach((element) => {
        const { type, data } = element;

        if (type === "new message") {
          dispatch(newMessageResived(data));
        }
        if (type === "roomLatestMessageChanged") {
          dispatch(roomLatestMessageChanged(data));
        }
      });
      dispatch(bucketCleared());
    }
  }, [changeBucket]);

  return <></>;
}

export default DispatchHandler;
