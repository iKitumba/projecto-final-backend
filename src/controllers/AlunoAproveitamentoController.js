const Alunos = require("../models/Alunos");

class AlunoAproveitamentoController {
  async show(req, res) {
    const { aluno_id } = req.params;

    const aluno = await Alunos.findByPk(aluno_id, {
      attributes: ["id", "nome_completo"],
      include: [
        {
          association: "notas",
          attributes: ["id", "nota_1", "nota_2", "nota_3", "media"],
        },
      ],
    });

    if (!aluno) {
      return res.status(404).json({ message: "Aluno nao encontrado" });
    }

    const { notas } = aluno;

    const notaTotal = notas.reduce((prev, next) => prev + next.media, 0); // total das notas
    const mediaTotal = Math.round(notaTotal / aluno.notas.length); // Média de todas notas
    const aproveitamento = (mediaTotal * 100) / 20;

    return res.json({ message: "Porcentagem", aproveitamento });
  }
}

module.exports = new AlunoAproveitamentoController();
