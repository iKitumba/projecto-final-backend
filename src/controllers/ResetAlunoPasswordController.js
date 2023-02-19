const Alunos = require("../models/Alunos");
const bcrypt = require("bcryptjs");

class ResetAlunoPasswordController {
  async update(req, res) {
    const { senha_antiga, nova_senha } = req.body;
    const { usuario_id } = req;
    const aluno = await Alunos.findOne({ where: { id: usuario_id } });

    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    if (!(await bcrypt.compare(senha_antiga, aluno.senha))) {
      return res.status(401).json({ message: "Senha atual incorreta" });
    }

    aluno.senha = await bcrypt.hash(nova_senha, 10);

    await aluno.save();

    aluno.senha = undefined;

    return res.json({ message: "Senha alterada com sucesso!" });
  }
}

module.exports = new ResetAlunoPasswordController();
