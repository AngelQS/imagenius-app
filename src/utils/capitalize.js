const capitalize = function (str) {
  return str.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};

module.exports = capitalize;
