const Alunos = require("../models/Alunos");
const bcrypt = require("bcryptjs");

exports.main = async function main(req, res) {
  const allAlunos = await Alunos.findAll();

  await Promise.all(
    allAlunos.map(async (aluno) => {
      aluno.senha = await bcrypt.hash("999", 10);

      await aluno.save();
    })
  );

  return res.json(allAlunos);
};
