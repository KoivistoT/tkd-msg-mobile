export default {
  questions: {
    LEAVE_ROOM_LAST_USER: {
      title: "Olet huoneen viimeinen käyttjä. Haluatko poistua huoneesta?",
      body: "Poistuttuasi, huone ja huoneen viestit poistetaan pysyvästi.",
    },
    LEAVE_ROOM: {
      title: "Haluatko poistua huoneesta?",
      body: "",
    },
    ACTIVATE_ROOM: {
      title: "Haluatko aktivoida huoneen?",
      body: "",
    },
    DELETE_ROOM: {
      title: "Haluatko poistaa huoneen?",
      body: "",
    },
    DELETE_USER: {
      title: "Haluatko poistaa käyttäjän?",
      body: "",
      success: "User deleted",
    },
    ARCHIVE_USER: {
      title: "Haluatko arkistoida käyttäjän?",
      body: "",
      success: "User archived",
    },
    ACTIVATE_USER: {
      title: "Haluatko aktivoida käyttäjän?",
      body: "",
      success: "User activated",
    },
    REMOVE_IMAGE: {
      title: "Remove",
      body: "Are you sure you want to remove this image?",
    },

    REMOVE_MESSAGE: {
      title: "Haluatko poistaa viestin?",
      body: "",
    },
  },
  notifications: {
    USER_REMOVED: "Käyttäjä on poistettu. Et voi lähettää hänelle viestejä.",
    CAMERA_PERMISSION: "You need to enable permission to access the camera.",
    LIBRARY_PERMISSION: "You need to enable permission to access the library.",
    ONLY_MEMBER: "You are only member in this chat.",
  },
};
