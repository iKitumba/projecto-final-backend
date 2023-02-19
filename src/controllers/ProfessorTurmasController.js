const AssociacaoPDT = require("../models/AssociacaoPDT");

class ProfessorTurmasController {
  async index(req, res) {
    const { tipo_usuario, usuario_id } = req;

    if (tipo_usuario === "PROFESSOR") {
      const turmasData = await AssociacaoPDT.findAll({
        where: { professor_id: usuario_id },
        attributes: ["id", "professor_id", "disciplina_id", "turma_id"],
        include: [
          {
            association: "disciplina",
            attributes: ["id", "titulo", "diminuitivo"],
          },
          {
            association: "turma",
            attributes: ["id", "classe", "letra", "turno"],
            include: [
              {
                association: "curso",
                attributes: ["id", "titulo", "diminuitivo"],
              },
              { association: "alunos" },
            ],
          },
        ],
      });

      const turmas = turmasData.map((turma) => {
        return {
          ...turma.dataValues.turma.dataValues,
          disciplina: turma.dataValues.disciplina.dataValues,
          alunos: turma.dataValues.turma.dataValues.alunos.length,
        };
      });

      return res.json({ turmas });
    } else {
      return res.redirect("/turmas");
    }
  }
}

module.exports = new ProfessorTurmasController();
