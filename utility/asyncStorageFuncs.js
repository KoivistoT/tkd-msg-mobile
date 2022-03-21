import AsyncStorage from "@react-native-async-storage/async-storage";

const setData = async (key, value) => {
  const jsonValue = JSON.stringify(value);
  try {
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log(error);
  }
};

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e, "code 99288112");
  }
};

export default {
  setData,
  getData,
};
