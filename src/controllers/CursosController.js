const Cursos = require("../models/Cursos");

class CursosController {
  async index(req, res) {
    const cursos = await Cursos.findAll({
      attributes: ["id", "titulo", "diminuitivo", "created_at"],
    });

    return res.json({ cursos });
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
        const curso = await Cursos.create({
          titulo,
          diminuitivo,
          criado_por: usuario_id,
        });

        return res.status(201).json({ curso });
      } catch (error) {
        return res.status(409).json({
          message: "Ja existe um curso com esse titulo ou diminuitivo",
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }
  }
}

module.exports = new CursosController();
