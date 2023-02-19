const AssociacaoPDT = require("../models/AssociacaoPDT");

class TurmasProfessoresController {
  async show(req, res) {
    const { turma_id } = req.params;
    try {
      const turma_professores_disciplinas = await AssociacaoPDT.findAll({
        where: { turma_id },
        attributes: ["id", "turma_id", "disciplina_id", "professor_id"],
        include: [
          {
            attributes: [
              "id",
              "nome_completo",
              "foto_perfil",
              "telefone",
              "foto_perfil_url",
            ],
            association: "professor",
          },
          {
            attributes: ["id", "titulo", "diminuitivo"],
            association: "disciplina",
          },
        ],
      });
      return res.json({ turma_professores_disciplinas });
    } catch (error) {
      return res.status(400).json({
        message:
          "Infelizmente nao conseguimos obter a lista dos professores desta turma, por favor tente novamente",
      });
    }
  }
}

module.exports = new TurmasProfessoresController();
