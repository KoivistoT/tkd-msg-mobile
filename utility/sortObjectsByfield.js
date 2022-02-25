export default sortObjectsByfield = (object, field) =>
  Object.values(object).sort(function (a, b) {
    var nameA = a[field];
    var nameB = b[field];

    if (nameA > nameB) {
      return 1;
    }
    if (nameA < nameB) {
      return -1;
    }
    return 0;
  });
