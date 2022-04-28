import React from "react";
import CreateChannelForm from "../app/components/forms/CreateChannelForm";

function CreateChannelScreen({}) {
  return <CreateChannelForm />;
}

function areEqual(prevProps, nextProps) {
  return true;
}

export const MemoCreateChannelScreen = React.memo(
  CreateChannelScreen,
  areEqual
);
