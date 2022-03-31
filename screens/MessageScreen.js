import React, { useState } from "react";
import MessageForm from "../app/components/MessageForm";
import Screen from "../app/components/Screen";
import MessageList from "../app/components/MessageList";

function MessageScreen(item) {
  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <Screen>
      <MessageList item={item} showSearchBar={showSearchBar} />
      <MessageForm
        item={item}
        setShowSearchBar={() => setShowSearchBar((prevState) => !prevState)}
      />
    </Screen>
  );
}

export default MessageScreen;
