import client from "./client";

const endpoint = "/messages/send_message";
const getMessages = () => client.get(endpoint);
const addMessageListener = () => client.get(endpoint + "/addMsgListener");

const addMessage = (message) => {
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

const sendMessage = (message = "jaaha") => {
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

export default { sendMessage, getMessages, addMessage, addMessageListener };
