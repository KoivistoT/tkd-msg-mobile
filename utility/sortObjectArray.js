export default sortObjectArray = (object, field = null) =>
  object.sort(function (a, b) {
    var itemA = field ? a[field] : a;
    var itemB = field ? b[field] : b;

    if (itemA > itemB) {
      return -1;
    }
    if (itemA < itemB) {
      return 1;
    }
    return 0;
  });
