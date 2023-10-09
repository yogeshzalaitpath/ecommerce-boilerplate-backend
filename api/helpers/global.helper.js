const capitalizeFirstLetter = (data) => {
  return data
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const fileNameGenerator = (user, fieldNames) => {
  const values = fieldNames.map(fieldName => user[fieldName]);
  if (values.every(value => value !== undefined)) {
      const fileName = values.join('-').toLowerCase();
      return fileName;
  } else {
      throw new Error('Invalid field names provided');
  }
};

module.exports = {
  capitalizeFirstLetter,
  escapeRegex,
  fileNameGenerator
};
