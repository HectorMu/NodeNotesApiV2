const controller = {};
const connection = require("../database");
const { matchPassword, encryptPassword } = require("../helpers/helpers");

controller.editNames = async (req, res) => {
  const { user } = req.token;
  const { firstname, lastname } = req.body;
  try {
    await connection.query(
      "update users set firstname = ?, lastname = ? where iduser = ?",
      [firstname, lastname, user.iduser]
    );
    const editedUser = await connection.query(
      "select firstname, lastname, email from users where iduser =? ",
      [user.iduser]
    );
    res.json({
      status: true,
      statusText: "Profile information changed",
      user: editedUser[0],
    });
  } catch (error) {
    console.log(error);
    res.json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.changePassword = async (req, res) => {
  const { user } = req.token;
  const { currentPassword, newPassword } = req.body;
  const passwordMatch = await matchPassword(currentPassword, user.pass);
  if (!passwordMatch)
    return res.json({
      status: false,
      statusText:
        "The current password provided doesn't match with your password.",
    });

  const password = await encryptPassword(newPassword);
  await connection.query("update users set pass = ? where iduser = ?", [
    password,
    user.iduser,
  ]);
  res.json({ status: true, statusText: "Account password changed" });
};

module.exports = controller;
