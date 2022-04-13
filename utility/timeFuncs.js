const _MS_PER_DAY = 86400000;

function getDateDiffInDays(a, b) {
  const utc1 = Date.UTC(getFullYear(a), getMonth(a), getDay(a));
  const utc2 = Date.UTC(getFullYear(b), getMonth(b), getDay(b));

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

const getTime = (date) => {
  return date.slice(11, 16);
};

const getDate = (date) => {
  return `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`;
};

const getDateAndTime = (date) => {
  return `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(
    0,
    4
  )} ${date.slice(11, 16)}`;
};

const dateWithLines = (date) =>
  `${date.slice(0, 4)}-${date.slice(5, 7)}-${date.slice(8, 10)}`;

const getFullYear = (date) => date.slice(0, 4);
const getMonth = (date) => date.slice(5, 7);
const getDay = (date) => date.slice(8, 10);

function getWeekDayNamesWithTimes(date) {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const diffInDays = getDateDiffInDays(date, new Date().toISOString());

  var d = new Date(dateWithLines(date));

  if (diffInDays < 1) {
    return getTime(date);
  } else if (diffInDays < 7) {
    return `${days[d.getDay()]} ${getTime(date)}`;
  } else {
    return getDateAndTime(date);
  }
}

function getWeekDayNames(date) {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const diffInDays = getDateDiffInDays(date, new Date().toISOString());

  var d = new Date(dateWithLines(date));

  if (diffInDays < 1) {
    return getTime(date);
  } else if (diffInDays < 7) {
    return `${days[d.getDay()]}`;
  } else {
    return getDateAndTime(date);
  }
}

export default {
  getDate,
  getWeekDayNamesWithTimes,
  getTime,
  getWeekDayNames,
  getDateAndTime,
};
