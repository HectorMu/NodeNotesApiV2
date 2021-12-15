const connection = require("../database");
const jwt = require("jsonwebtoken");
let today = new Date();
const controller = {};

controller.test = (req, res) => {
  res.json({ Test: "Hi, im working" });
};

controller.ListAll = async (req, res) => {
  const { user } = req.token;
  const results = await connection.query(
    "Select * from notes where fkuser = ?",
    [user.iduser]
  );
  if (!results.length > 0)
    return res.status(200).json({ status: true, statusText: "userNotesEmpty" });
  res.json(results);
};
controller.ListOne = async (req, res) => {
  const { idnote } = req.params;
  const { user } = req.token;
  const results = await connection.query(
    `select * from notes where idnote=${idnote} && fkuser = ?`,
    [user.iduser]
  );
  if (results.length > 0) {
    res.json(results);
  } else {
    res.status(404).json({ results: "Not found" });
  }
};

controller.Save = async (req, res) => {
  const { user } = req.token;

  const { title, content, importance } = req.body;
  const createdat = today.toLocaleDateString("en-US");
  const newNote = {
    title,
    content,
    importance,
    createdat,
    fkuser: user.iduser,
  };
  try {
    await connection.query("insert into notes set ?", [newNote]);
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, error });
  }
};

controller.Update = async (req, res) => {
  const { idnote } = req.params;
  const { title, content, importance } = req.body;
  const { user } = req.token;
  const updatedNote = { title, content, importance, fkuser: user.iduser };
  try {
    await connection.query(
      "update notes set ? where idnote = ? && fkuser  = ?",
      [updatedNote, idnote, user.iduser]
    );
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, error });
  }
};
controller.Delete = async (req, res) => {
  const { idnote } = req.params;
  const { user } = req.token;
  try {
    await connection.query("delete from notes where idnote = ? && fkuser = ?", [
      idnote,
      user.iduser,
    ]);
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, error });
  }
};
module.exports = controller;
