const connection = require("../database");
const jwt = require("jsonwebtoken");
const controller = {};
controller.login = async (req, res) => {
  const { email, pass } = req.body;
  const results = await connection.query(
    `select * from users where email = ? `,
    [email]
  );
  if (!results.length > 0) return res.status(400).json({ status: false });

  const user = results[0];

  if (user.pass !== pass) return res.status(400).json({ status: false });
  const payload = {
    user,
  };
  const serializedUser = {
    id: user.iduser,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
  };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
  res.status(200).json({ accessToken, serializedUser });
};

controller.signup = () => {};
module.exports = controller;
