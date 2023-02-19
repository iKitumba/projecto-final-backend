const Usuarios = require("../models/Usuarios");
const Disciplinas = require("../models/Disciplinas");
const Turmas = require("../models/Turmas");
const AssociacaoPDT = require("../models/AssociacaoPDT");
const Notas = require("../models/Notas");

const Alunos = require("../models/Alunos");

class ProfessorDisciplinaController {
  async index(req, res) {
    const associacoesPDP = await AssociacaoPDT.findAll({
      include: [
        {
          association: "professor",
        },
        {
          association: "disciplina",
        },
        {
          association: "turma",
        },
      ],
    });

    return res.json({ associacoesPDP });
  }

  async store(req, res) {
    const { tipo_usuario, usuario_id } = req;
    const { professor_id, disciplina_id, turma_id } = req.params;

    if (tipo_usuario === "ADMIN" || tipo_usuario === "PROFESSOR_ADMIN") {
      const professor = await Usuarios.findByPk(professor_id);

      if (!professor) {
        return res.status(404).json({ message: "Esse professor nao existe" });
      }

      if (
        professor.tipo_usuario === "PROFESSOR" ||
        professor.tipo_usuario === "PROFESSOR_ADMIN"
      ) {
        const turma = await Turmas.findByPk(turma_id);

        if (!turma) {
          return res.status(404).json({ message: "Essa turma nao existe" });
        }

        const disciplina = await Disciplinas.findByPk(disciplina_id);

        if (!disciplina) {
          return res
            .status(404)
            .json({ message: "Essa disciplina nao existe" });
        }

        const [associadoPDT, created] = await AssociacaoPDT.findOrCreate({
          where: { professor_id, turma_id, disciplina_id },
        });

        const allAlunos = await Alunos.findAll({ where: { turma_id } });

        allAlunos.forEach(async ({ dataValues: aluno }) => {
          await Promise.all([
            Notas.findOrCreate({
              where: {
                disciplina_id,
                aluno_id: aluno.id,
                trimestre: "PRIMEIRO",
              },
            }),
            Notas.findOrCreate({
              where: {
                disciplina_id,
                aluno_id: aluno.id,
                trimestre: "SEGUNDO",
              },
            }),
            Notas.findOrCreate({
              where: {
                disciplina_id,
                aluno_id: aluno.id,
                trimestre: "TERCEIRO",
              },
            }),
          ]);
        });

        if (!created) {
          return res.status(409).json({
            message: "Esse professor ja leciona essa disciplina nessa turma",
          });
        }

        return res.status(201).json({ message: "Associcao feita com sucesso" });
      } else {
        return res
          .status(400)
          .json({ message: "Esse usuario nao e um professor" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }
  }
}

module.exports = new ProfessorDisciplinaController();
