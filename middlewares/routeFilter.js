exports.isSearch = (req, res, next) => {
  if (!req.params) {
    next()
  }
  return false
}
