export default {
  questions: {
    LEAVE_ROOM_LAST_USER: {
      title: "You are last user in the chat. Do you want to leave chat?",
      body: "If you leave chat, chat and all messages would be removed.",
    },
    LEAVE_ROOM: {
      title: "Do you want to leave chat?",
      body: "",
    },
    ACTIVATE_ROOM: {
      title: "Do you want to activate chat?",
      body: "",
    },
    DELETE_ROOM: {
      title: "Do you want to remove chat?",
      body: "",
    },
    DELETE_USER: {
      title: "Do you want to remove user?",
      body: "",
      success: "User removed",
    },
    ARCHIVE_USER: {
      title: "Do you want to archive user?",
      body: "",
      success: "User archived",
    },
    ACTIVATE_USER: {
      title: "Do you want to activate user?",
      body: "",
      success: "User activated",
    },
    REMOVE_IMAGE: {
      title: "Remove",
      body: "Do you want to remove this image?",
    },

    REMOVE_MESSAGE: {
      title: "Do you want to remove this message?",
      body: "",
    },
  },
  notifications: {
    USER_REMOVED: "User has been removed. You can not send messages.",
    CAMERA_PERMISSION: "You need to enable permission to access the camera.",
    LIBRARY_PERMISSION: "You need to enable permission to access the library.",
    ONLY_MEMBER: "You are only member in this chat.",
  },
};
