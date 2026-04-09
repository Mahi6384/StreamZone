/**
 * Express 4: route async (req, res) => {} rejections must call next(err)
 * or the default HTML error page is sent.
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
