export default sortArray = (array, field) =>
  array.sort(function (a, b) {
    var A = field ? a[field] : a;
    var B = field ? b[field] : b;

    if (A > B) {
      return 1;
    }
    if (A < B) {
      return -1;
    }
    return 0;
  });
