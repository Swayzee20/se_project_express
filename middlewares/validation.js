const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length fo the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required.custom(validateURL).message({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length fo the "name" field is 30',
    }),

    avatar: Joi.string().required().custom(validateURL).message({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),

    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": "Please enter a valid email",
    }),

    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": "Please enter a valid email",
    }),
    password: Joi.string.required.messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateClothingId = celebrate({
  params: Joi.object().keys({
    item_id: Joi.string().hex().length(24).messages({
      "string.hex": "id must be hexadecimal value",
      "string.length": "id must be 24 characters",
    }),
  }),
});
