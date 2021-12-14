const connection = require("../database");
const jwt = require("jsonwebtoken");
const helpers = require("../helpers/helpers");
const controller = {};
controller.login = async (req, res) => {
  const { email, pass } = req.body;
  const results = await connection.query(
    `select * from users where email = ? `,
    [email]
  );
  if (!results.length > 0) return res.status(400).json({ status: false });

  const user = results[0];
  const passwordComparationResult = await helpers.matchPassword(
    pass,
    user.pass
  );
  if (!passwordComparationResult)
    return res.status(400).json({ status: false });
  const payload = {
    user,
  };
  const serializedUser = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
  };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
  res.status(200).json({ accessToken, serializedUser });
};

controller.signup = async (req, res) => {
  const { firstname, lastname, email, pass } = req.body;
  const results = await connection.query(
    `select * from users where email = ? `,
    [email]
  );
  if (results.length > 0)
    return res.json({ status: false, statusText: "emailAlreadyInUse" });

  const newUser = {
    firstname,
    lastname,
    email,
    pass,
  };
  newUser.pass = await helpers.encryptPassword(newUser.pass);
  await connection.query("insert into users set ?", [newUser]);
  res.status(200).json({ status: true, statusText: "userRegistered" });
};
module.exports = controller;
