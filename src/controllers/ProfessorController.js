const Usuarios = require("../models/Usuarios");
const AssociacaoPDT = require("../models/AssociacaoPDT");

class ProfessorController {
  async show(req, res) {
    const { tipo_usuario, usuario_id } = req;
    if (tipo_usuario === "PROFESSOR" || tipo_usuario === "PROFESSOR_ADMIN") {
      const professor = await Usuarios.findByPk(usuario_id);
      const associacoesPDT = await AssociacaoPDT.findAll({
        where: { professor_id: usuario_id },
        include: [
          {
            association: "turma",
            include: [{ association: "curso" }],
          },
          { association: "disciplina" },
        ],
      });

      return res.json({ professor, associacoesPDT });
    } else {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }
  }
}

module.exports = new ProfessorController();
