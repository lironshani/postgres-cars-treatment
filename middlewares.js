const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        console.log("Error veryfing token: ",err);
        res.redirect("/sign-up");
      } else {
        console.log("Success veryfing token: ",decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/sign-up");
  }
};

module.exports = { verifyToken };
