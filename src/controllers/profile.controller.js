const controller = {};
const connection = require("../database");
const { matchPassword, encryptPassword } = require("../helpers/helpers");

controller.getProfileData = async (req, res) => {
  const { user } = req.token;
  try {
    const userData = await connection.query(
      "Select * from users where iduser = ?",
      [user.iduser]
    );
    const numberOfNotes = await connection.query(
      "select count(*) as quantity from notes where fkuser = ?",
      [user.iduser]
    );
    const serializedUser = {
      firstname: userData[0].firstname,
      lastname: userData[0].lastname,
      email: userData[0].email,
      notesCount: numberOfNotes[0].quantity,
    };
    res.json(serializedUser);
  } catch (error) {
    console.log(error);
    res.json({ status: false, statusText: "Something wen't wrong." });
  }
};

controller.editNames = async (req, res) => {
  const { user } = req.token;
  const { firstname, lastname } = req.body;
  try {
    await connection.query(
      "update users set firstname = ?, lastname = ? where iduser = ?",
      [firstname, lastname, user.iduser]
    );
    const editedUser = await connection.query(
      "select * from users where iduser = ? ",
      [user.iduser]
    );
    const numberOfNotes = await connection.query(
      "select count(*) as quantity from notes where fkuser = ?",
      [user.iduser]
    );
    const serializedUser = {
      firstname: editedUser[0].firstname,
      lastname: editedUser[0].lastname,
      email: editedUser[0].email,
      notesCount: numberOfNotes[0].quantity,
    };

    res.json({
      status: true,
      statusText: "Profile information changed",
      user: serializedUser,
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

controller.deleteProfile = async (req, res) => {
  const { user } = req.token;
  const { pass } = req.body;
  try {
    const savedUser = await connection.query(
      "Select * from users where iduser = ?",
      [user.iduser]
    );
    const passwordMatch = await matchPassword(pass, savedUser[0].pass);
    if (!passwordMatch)
      return res.json({
        status: false,
        statusText:
          "The current password provided doesn't match with your password.",
      });

    await connection.query("delete  from notes where fkuser = ? ", [
      user.iduser,
    ]);
    await connection.query("delete  from users where iduser = ?", [
      user.iduser,
    ]);
    res.json({ status: true, statusText: "Account deleted succesfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: false, statusText: "Something wen't wrong." });
  }
};
module.exports = controller;
