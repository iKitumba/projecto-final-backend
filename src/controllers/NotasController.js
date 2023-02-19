const Notas = require("../models/Notas");
const trimestreTypes = require("../constants/tiposTrimestres");
const Alunos = require("../models/Alunos");
const Disciplinas = require("../models/Disciplinas");
const AssociacaoPDT = require("../models/AssociacaoPDT");

class NotasController {
  async index(req, res) {
    const { aluno_id } = req.params;

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
      primeiro_timestre,
      segundo_trimestre,
      terceiro_trimestre,
    });
  }

  async store(req, res) {
    const { trimestre, nota_1, nota_2, nota_3 } = req.body;
    const { tipo_usuario, usuario_id } = req;
    const { disciplina_id, aluno_id } = req.params;
    console.table({ tipo_usuario, usuario_id });
    if (tipo_usuario !== "PROFESSOR" && tipo_usuario !== "PROFESSOR_ADMIN") {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }

    if (!trimestreTypes.includes(String(trimestre).toUpperCase())) {
      return res.status(400).json({ message: "Trimestre invalido" });
    }

    const aluno = await Alunos.findByPk(aluno_id);
    const disciplina = await Disciplinas.findByPk(disciplina_id);

    if (!aluno) {
      return res.status(404).json({ message: "Esse aluno nao existe" });
    }

    if (!disciplina) {
      return res.status(404).json({ message: "Essa disciplina nao existe" });
    }

    const associadoPDT = await AssociacaoPDT.findOne({
      where: {
        professor_id: usuario_id,
        disciplina_id,
        turma_id: aluno.turma_id,
      },
    });

    if (!associadoPDT) {
      return res.status(400).json({
        message: "Esse professor nao leciona essa disciplina nessa turma",
      });
    }

    try {
      let nota = await Notas.findOne({
        where: { disciplina_id, aluno_id, trimestre },
      });

      if (nota) {
        return res.json({ nota });
      } else {
        nota = await Notas.create({
          nota_1,
          nota_2,
          nota_3,
          disciplina_id,
          aluno_id,
          trimestre,
        });

        return res.status(201).json({ nota });
      }
    } catch (error) {
      return res.status(409).json({
        message: "Houve um erro no lançamento das notas, tente novamente",
        error,
      });
    }
  }

  async update(req, res) {
    const { nota_1, nota_2, nota_3 } = req.body;
    const { nota_id } = req.params;
    const { tipo_usuario, usuario_id } = req;

    if (tipo_usuario !== "PROFESSOR" && tipo_usuario !== "PROFESSOR_ADMIN") {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }

    const nota = await Notas.findOne({
      where: { id: nota_id },
      include: [{ association: "aluno" }],
    });

    if (!nota) {
      return res
        .status(404)
        .json({ message: "Notas nao encontradas no servidor" });
    }

    const associadoPDT = await AssociacaoPDT.findOne({
      where: {
        professor_id: usuario_id,
        disciplina_id: nota.disciplina_id,
        turma_id: nota.aluno.turma_id,
      },
    });

    if (!associadoPDT) {
      return res.status(400).json({
        message: "Esse professor nao leciona essa disciplina nessa turma",
      });
    }

    try {
      await nota.update({ nota_1, nota_2, nota_3 });

      return res.json({ message: "Notas atualizadas com sucesso!" });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Todas as notas devem estar no intervalo de 0 à 20" });
    }
  }
}

module.exports = new NotasController();
