const Alunos = require("../models/Alunos");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

class AlunosSessionController {
  async store(req, res) {
    const { bi, senha } = req.body;
    const aluno = await Alunos.findOne({ where: { bi } });

    if (!aluno) {
      return res.status(404).json({ message: "Aluno nao encontrado" });
    }

    if (!(await bcrypt.compare(senha, aluno.senha))) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    aluno.senha = undefined;

    const token = generateToken({
      id: aluno.id,
    });

    return res.json({ aluno, token });
  }
}

module.exports = new AlunosSessionController();
