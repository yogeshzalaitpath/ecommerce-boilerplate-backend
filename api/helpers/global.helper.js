const capitalizeFirstLetter = (data) => {
  return data
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

module.exports = {
  capitalizeFirstLetter,
};
