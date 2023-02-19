const Disciplinas = require("../models/Disciplinas");

class DisciplinasController {
  async index(req, res) {
    const disciplinas = await Disciplinas.findAll({
      attributes: ["id", "titulo", "diminuitivo", "created_at"],
    });

    return res.json({ disciplinas });
  }

  async store(req, res) {
    const { titulo, diminuitivo } = req.body;

    const { tipo_usuario, usuario_id } = req;

    if (tipo_usuario === "ADMIN" || tipo_usuario === "PROFESSOR_ADMIN") {
      if (!titulo) {
        return res
          .status(400)
          .json({ message: "O titulo do curso é obrigatorio" });
      }

      try {
        const diciplina = await Disciplinas.create({
          titulo,
          diminuitivo,
          criado_por: usuario_id,
        });

        return res.status(201).json({ diciplina });
      } catch (error) {
        return res.status(409).json({
          message: "Ja existe uma diciplina com esse titulo ou diminuitivo",
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }
  }
}

module.exports = new DisciplinasController();
