const getTime = (date) => {
  return date.slice(11, 16);
};

const getDate = (date) => {
  return `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`;
};

export default {
  getDate,
  getTime,
};
