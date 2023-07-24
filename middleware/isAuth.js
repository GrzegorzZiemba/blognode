const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (token == null) {
    req.user = null;
    next();
  } else {
    console.log("verify");
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
    console.log(decodedToken);
    if (decodedToken) {
      req.user = decodedToken._id;
    } else {
      req.user = null;
    }
    next();
  }
};
