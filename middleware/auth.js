// Accessing only when a user is signed up

const verifyAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = { verifyAuth };
