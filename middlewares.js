const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    jwt.verify(token, proces.env.SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/sign-up");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/sign-up");
  }
};

module.exports = { verifyToken };
