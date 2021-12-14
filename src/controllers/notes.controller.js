const connection = require("../database");

let today = new Date();
const controller = {};

controller.test = (req, res) => {
  res.json({ Test: "Hi, im working" });
};

controller.ListAll = async (req, res) => {
  const results = await connection.query("Select * from notes");
  res.json(results);
};
controller.ListOne = async (req, res) => {
  const { idnote } = req.params;
  const results = await connection.query(
    `select * from notes where idnote=${idnote}`
  );
  if (results.length > 0) {
    res.json(results);
  } else {
    res.status(404).json({ results: "Not found" });
  }
};

controller.Save = async (req, res) => {
  const { title, content, importance, fkuser } = req.body;
  const createdat = today.toLocaleDateString("en-US");
  const newNote = { title, content, importance, createdat, fkuser };
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
  const { title, content, importance, fkuser } = req.body;
  const updatedNote = { title, content, importance, fkuser };
  try {
    await connection.query("update notes set ? where idnote = ?", [
      updatedNote,
      idnote,
    ]);
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, error });
  }
};
controller.Delete = async (req, res) => {
  const { idnote } = req.params;
  try {
    await connection.query("delete from notes where idnote = ?", [idnote]);
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, error });
  }
};
module.exports = controller;
