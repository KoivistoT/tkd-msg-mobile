export default (array, field, order = "ASC") => {
  const isField = (currenField, item) => {
    if (currenField) {
      return item[currenField];
    } else {
      return item;
    }
  };

  return array.sort(function (a, b) {
    var A = isField(field, a);
    var B = isField(field, b);

    if (A > B) {
      return order === "ASC" ? 1 : -1;
    }
    if (A < B) {
      return order === "ASC" ? -1 : 1;
    }
    return 0;
  });
};
