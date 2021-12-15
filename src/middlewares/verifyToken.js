const jwt = require("jsonwebtoken");
const verifiyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.token = decodedToken;
    if (decodedToken) next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ authorized: false });
    return;
  }
};

module.exports = verifiyToken;
