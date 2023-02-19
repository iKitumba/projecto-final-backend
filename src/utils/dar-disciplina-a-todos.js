const Alunos = require("../models/Alunos");
const AssociacaoPDT = require("../models/AssociacaoPDT");
const Notas = require("../models/Notas");

exports.main = async function main(req, res) {
  const allAlunos = await Alunos.findAll();
  console.log(allAlunos);
  allAlunos.forEach(async ({ dataValues: aluno }) => {
    const associacoes = await AssociacaoPDT.findAll({
      where: { turma_id: aluno.turma_id },
    });

    associacoes.forEach(async ({ dataValues: associacao }) => {
      await Promise.all([
        Notas.findOrCreate({
          where: {
            disciplina_id: associacao.disciplina_id,
            aluno_id: aluno.id,
            trimestre: "PRIMEIRO",
          },
        }),
        Notas.findOrCreate({
          where: {
            disciplina_id: associacao.disciplina_id,
            aluno_id: aluno.id,
            trimestre: "SEGUNDO",
          },
        }),
        Notas.findOrCreate({
          where: {
            disciplina_id: associacao.disciplina_id,
            aluno_id: aluno.id,
            trimestre: "TERCEIRO",
          },
        }),
      ]);
    });
  });

  return res.json({ ok: true });
};
