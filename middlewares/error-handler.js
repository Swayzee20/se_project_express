module.exports = (err, req, res, next) => {
  console.error(err);
  const { statusCode = 500 } = err;
  return res.status(err.statusCode).send({
    message:
      statusCode === 500 ? "An error occured on the server" : err.message,
  });
};
