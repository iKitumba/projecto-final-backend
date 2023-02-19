const Alunos = require("../models/Alunos");
const path = require("path");
const fs = require("fs");
const generoTpes = require("../constants/tiposGeneros");
const Turmas = require("../models/Turmas");
const Notas = require("../models/Notas");
const AssociacaoPDT = require("../models/AssociacaoPDT");

class AlunosController {
  async index(req, res) {
    const tipo_usuario = req.tipo_usuario;
    const { turma_id } = req.params;

    if (tipo_usuario) {
      const turma = await Turmas.findByPk(turma_id);

      if (!turma) {
        return res.status(404).json({ message: "Essa turma nao existe" });
      }

      const alunos = await Alunos.findAll({
        where: { turma_id },
        attributes: [
          "id",
          "nome_completo",
          "foto_perfil",
          "foto_perfil_url",
          "genero",
          "telefone_1",
          "telefone_2"
        ],
        order: [["nome_completo", "ASC"]],
      });

      return res.json({ alunos });
    } else {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }
  }

  async show(req, res) {
    const { aluno_id } = req.params;
    const aluno = await Alunos.findByPk(aluno_id, {
      attributes: [
        "id",
        "nome_completo",
        "nome_pai",
        "nome_mae",
        "telefone_1",
        "telefone_2",
        "foto_perfil",
        "foto_perfil_url",
        "nascimento",
        "turma_id",
        "created_at",
      ],
      include: [
        {
          association: "turma",
          attributes: ["id", "letra", "turno", "classe", "curso_id"],
          include: [
            {
              association: "curso",
              attributes: ["id", "titulo", "diminuitivo"],
            },
          ],
        },
      ],
    });

    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    const [primeiro_timestre, segundo_trimestre, terceiro_trimestre] =
      await Promise.all([
        Notas.findAll({
          where: { aluno_id, trimestre: "PRIMEIRO" },
          include: [{ association: "disciplina" }],
        }),
        Notas.findAll({
          where: { aluno_id, trimestre: "SEGUNDO" },
          include: [{ association: "disciplina" }],
        }),
        Notas.findAll({
          where: { aluno_id, trimestre: "TERCEIRO" },
          include: [{ association: "disciplina" }],
        }),
      ]);

    return res.json({
      aluno,
      notas: {
        primeiro_timestre,
        segundo_trimestre,
        terceiro_trimestre,
      },
    });
  }

  async store(req, res) {
    const {
      nome_completo,
      genero,
      nome_pai,
      nome_mae,
      telefone_1,
      telefone_2,
      bi,
      endereco,
      nascimento,
    } = req.body;
    const { filename: foto_perfil } = req.file;
    const { tipo_usuario, usuario_id } = req;
    const { turma_id } = req.params;

    const possibleAluno = await Alunos.findOne({ where: { bi } });

    if (possibleAluno) {
      return fs.unlink(
        path.resolve(__dirname, "..", "..", "uploads", "profile", foto_perfil),
        (err) => {
          if (err) {
            console.log(err);
          }
          return res.status(409).send({ message: "Esse aluno ja existe" });
        }
      );
    }

    const turma = await Turmas.findByPk(turma_id);

    if (!turma) {
      return res.status(404).json({ message: "Essa turma nao existe" });
    }

    if (tipo_usuario === "ADMIN" || tipo_usuario === "PROFESSOR_ADMIN") {
      if (!generoTpes.includes(String(genero).toUpperCase())) {
        return fs.unlink(
          path.resolve(
            __dirname,
            "..",
            "..",
            "uploads",
            "profile",
            foto_perfil
          ),
          (err) => {
            if (err) {
              console.log(err);
            }
            return res.status(400).send({ message: "Tipo de genero invalido" });
          }
        );
      }

      try {
        const aluno = await Alunos.create({
          nome_completo,
          genero: genero.toUpperCase(),
          nome_pai,
          nome_mae,
          telefone_1,
          telefone_2,
          foto_perfil,
          bi,
          endereco,
          nascimento,
          turma_id,
          criado_por: usuario_id,
        });

        const disciplinas = await AssociacaoPDT.findAll({
          where: { turma_id },
          attributes: ["disciplina_id"],
        });

        disciplinas.forEach(async ({ dataValues: disciplina }) => {
          console.log(disciplina);
          await Promise.all([
            Notas.create({
              disciplina_id: disciplina.disciplina_id,
              aluno_id: aluno.id,
              trimestre: "PRIMEIRO",
            }),
            Notas.create({
              disciplina_id: disciplina.disciplina_id,
              aluno_id: aluno.id,
              trimestre: "SEGUNDO",
            }),
            Notas.create({
              disciplina_id: disciplina.disciplina_id,
              aluno_id: aluno.id,
              trimestre: "TERCEIRO",
            }),
          ]);
        });

        return res.status(201).json({ aluno });
      } catch (error) {
        return fs.unlink(
          path.resolve(
            __dirname,
            "..",
            "..",
            "uploads",
            "profile",
            foto_perfil
          ),
          (err) => {
            if (err) {
              console.log(err);
            }

            const errorMessage = new Error(error).message;
            console.clear();
            console.log(errorMessage);
            return res.status(409).send({
              message: `Esse aluno ja existe`,
            });
          }
        );
      }
    } else {
      return fs.unlink(
        path.resolve(__dirname, "..", "..", "uploads", "profile", foto_perfil),
        (err) => {
          if (err) {
            console.log(err);
          }
          return res
            .status(401)
            .json({ message: "Nao pode realizar essa operacao" });
        }
      );
    }
  }
}

module.exports = new AlunosController();
