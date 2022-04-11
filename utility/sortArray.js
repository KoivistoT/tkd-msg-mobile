export default sortArray = (array, field, order = "ASC") =>
  array.sort(function (a, b) {
    var A = field ? a[field] : a;
    var B = field ? b[field] : b;

    if (A > B) {
      return order === "ASC" ? 1 : -1;
    }
    if (A < B) {
      return order === "ASC" ? -1 : 1;
    }
    return 0;
  });
