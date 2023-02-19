const Turmas = require("../models/Turmas");

class RelatorioController {
  async index(req, res) {
    const turmas = await Turmas.findAll({
      attributes: ["id", "letra", "turno", "classe", "curso_id"],
      include: [
        { association: "curso", attributes: ["titulo", "diminuitivo"] },
        {
          association: "alunos",
          attributes: [
            "id",
            "nome_completo",
            "telefone_1",
            "telefone_2",
            "nascimento",
          ],
          include: [
            {
              association: "notas",
              attributes: [
                "id",
                "trimestre",
                "nota_1",
                "nota_2",
                "nota_3",
                "disciplina_id",
              ],
              include: [
                {
                  association: "disciplina",
                  attributes: ["titulo", "diminuitivo"],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).send({ turmas });
  }
}

module.exports = new RelatorioController();
