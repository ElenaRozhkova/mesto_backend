const validator = require('validator');
const ValidationError = require('../errors/validation-error.js');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new ValidationError('URL validation err');
};
module.exports = method;
