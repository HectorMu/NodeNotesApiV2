const connection = require("../database");
const jwt = require("jsonwebtoken");
const helpers = require("../helpers/helpers");
const nodeMailer = require("../lib/nodemailer");
const controller = {};
controller.login = async (req, res) => {
  const { email, pass } = req.body;
  try {
    const results = await connection.query(
      `select * from users where email = ? `,
      [email]
    );
    if (!results.length > 0)
      return res.status(400).json({
        status: false,
        statusText: "Wrong credentials, check it out.",
      });

    const user = results[0];
    const passwordComparationResult = await helpers.matchPassword(
      pass,
      user.pass
    );
    if (!passwordComparationResult)
      return res.status(400).json({
        status: false,
        statusText: "Wrong credentials, check it out.",
      });
    const payload = {
      user,
    };
    const numberOfNotes = await connection.query(
      "select count(*) as quantity from notes where fkuser = ?",
      [user.iduser]
    );
    const serializedUser = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      notesCount: numberOfNotes[0].quantity,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({
      status: true,
      statusText: "User logged",
      accessToken,
      serializedUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.signup = async (req, res) => {
  const { firstname, lastname, email, pass } = req.body;
  try {
    const results = await connection.query(
      `select * from users where email = ? `,
      [email]
    );
    if (results.length > 0)
      return res.json({
        status: false,
        statusText:
          "An account is using this email already, try another email.",
      });

    const newUser = {
      firstname,
      lastname,
      email,
      pass,
    };
    newUser.pass = await helpers.encryptPassword(newUser.pass);
    await connection.query("insert into users set ?", [newUser]);
    res.status(200).json({ status: true, statusText: "userRegistered" });
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.sendRecoverEmail = async (req, res) => {
  const { email } = req.body;
  const rows = await connection.query("select * from users where email = ?", [
    email,
  ]);
  if (rows.length > 0) {
    nodeMailer.Send(req, res);
  } else {
    res.status(200).json({
      status: false,
      statusText:
        "Provided email invalid, no existing account with this email.",
    });
  }
};
controller.VerifyRecoverEmailToken = (req, res) => {
  const { token } = req.params;
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.EMAIL_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          err = {
            name: "TokenExpiredError",
            message: "jwt expired",
            status: false,
          };
          return;
        } else {
          return {
            status: true,
            decoded,
          };
        }
      }
    );

    if (!decodedToken.status)
      return res
        .status(200)
        .json({ status: false, statusText: "Invalid toke, token expired" });

    res.status(200).json({ status: true, statusText: "Valid token" });
  } catch (error) {
    res
      .status(200)
      .json({
        status: false,
        statusText: "Invalid token, token malformed or expired",
      });
  }
};
module.exports = controller;
