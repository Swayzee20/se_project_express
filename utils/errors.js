const BAD_REQUEST = 400;
const INVALID_DATA = 401;
const NOT_AUTHORIZED = 403;
const NOT_FOUND = 404;
const ALREADY_EXISTS = 409;
const DEFAULT = 500;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  NOT_AUTHORIZED,
  INVALID_DATA,
  ALREADY_EXISTS,
  NotFoundError,
};
