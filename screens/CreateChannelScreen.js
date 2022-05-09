import React from "react";
import CreateChannelForm from "../app/components/forms/CreateChannelForm";

function CreateChannelScreen() {
  return <CreateChannelForm />;
}

export const MemoCreateChannelScreen = React.memo(CreateChannelScreen);
