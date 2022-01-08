import client from "./client";

const endpoint = "/messages/send_message2";
const getMessages = () => client.get(endpoint);
const addMessageListener = () => client.get(endpoint + "/addMsgListener");

const addMessage = (message, token) => {
  //   const data = new FormData();
  //   //muuta messagen message text, ettei tule message.message
  //   data.append("message", message);
  //   data.append("date", Date.now());
  //     console.log(data);
  const data = {
    message,
    date: Date.now(),
  };

  return client.post(endpoint, data);
};

const sendMessage = (
  message = "jaaha",
  roomId = "61d35b8945d1e3e2bc83ff10"
) => {
  //   const data = new FormData();
  //   //muuta messagen message text, ettei tule message.message
  //   data.append("message", message);
  //   data.append("date", Date.now());
  //     console.log(data);
  const data = {
    messageBody: message,
    date: Date.now(),
    roomId,
  };
  return client.post(endpoint, data);
};

export default { sendMessage, getMessages, addMessage, addMessageListener };
