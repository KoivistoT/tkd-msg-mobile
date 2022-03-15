import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bucketCleared, selectChangeBucket } from "../../store/currentUser";
import { newMessageResived } from "../../store/msgStore";
import { roomLatestMessageChanged } from "../../store/rooms";

function DispatchHandler() {
  const changeBucket = useSelector(selectChangeBucket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (changeBucket && changeBucket.length !== 0) {
      if (changeBucket && changeBucket.length !== 0) {
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
    }
  }, [changeBucket]);

  return <></>;
}

export default DispatchHandler;
