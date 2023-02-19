const Turmas = require("../models/Turmas");
const Cursos = require("../models/Cursos");
const formatClasse = require("../utils/formatClasse");
const tiposTurnos = require("../constants/tiposTurnos");
const Alunos = require("../models/Alunos");

class TurmasController {
  async index(req, res) {
    const turmasData = await Turmas.findAll({
      order: ["classe", "letra"],
      attributes: ["id", "letra", "turno", "classe"],
      include: [
        { association: "curso", attributes: ["id", "titulo", "diminuitivo"] },
        {
          association: "alunos",
          attributes: ["nome_completo"],
        },
      ],
    });

    const turmas = turmasData.map((turma) => {
      return {
        ...turma.dataValues,
        alunos: turma.dataValues.alunos.length,
      };
    });

    return res.json({ turmas });
  }

  async store(req, res) {
    const { letra, turno, classe } = req.body;
    const { curso_id } = req.params;

    const { tipo_usuario, usuario_id } = req;

    if (tipo_usuario === "ADMIN" || tipo_usuario === "PROFESSOR_ADMIN") {
      if (!tiposTurnos.includes(String(turno).toUpperCase())) {
        return res.status(400).json({ error: "Turno invalido" });
      }

      if (Number(classe) >= 10 && Number(classe) <= 13) {
        const curso = await Cursos.findByPk(curso_id);

        if (curso) {
          const [turma, created] = await Turmas.findOrCreate({
            where: {
              letra: String(letra).toUpperCase(),
              turno: String(turno).toUpperCase(),
              classe: formatClasse(classe),
              criado_por: usuario_id,
              curso_id,
            },
          });

          if (created) {
            return res.json({ turma });
          } else {
            return res.status(400).json({ message: "Essa turma ja existe" });
          }
        } else {
          return res.status(404).json({ message: "Curso nao encontrado" });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Classe invalida para esse curso" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }
  }

  async show(req, res) {
    const { turma_id } = req.params;

    try {
      const turma = await Turmas.findByPk(turma_id);

      if (!turma) {
        return res.status(404).json({ message: "Essa turma nao existe" });
      }

      const alunos = await Alunos.findAll({
        where: { turma_id },
        order: [["nome_completo", "ASC"]],
        include: [
          {
            association: "notas",
            attributes: [
              "id",
              "nota_1",
              "nota_2",
              "nota_3",
              "trimestre",
              "media",
            ],
          },
        ],
      });

      return res.json({ alunos });
    } catch (error) {
      return res.status(400).json({
        message: "Ocorreu um erro durante a listagem, tente mais tarde",
      });
    }
  }
}

module.exports = new TurmasController();
