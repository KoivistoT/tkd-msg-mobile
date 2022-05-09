export default (object, field = null) => {
  const isField = (currenField, item) => {
    if (currenField) {
      return item[currenField];
    } else {
      return item;
    }
  };

  return object.sort(function (a, b) {
    var itemA = isField(field, a);
    var itemB = isField(field, b);

    if (itemA > itemB) {
      return -1;
    }
    if (itemA < itemB) {
      return 1;
    }

    return 0;
  });
};
