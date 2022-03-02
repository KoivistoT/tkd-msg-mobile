export default sortArray = (array) =>
  array.sort(function (a, b) {
    var nameA = a;
    var nameB = b;

    if (nameA > nameB) {
      return 1;
    }
    if (nameA < nameB) {
      return -1;
    }
    return 0;
  });
