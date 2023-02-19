const Comunicados = require("../models/Comunicados");

class ComunicadosController {
  async index(req, res) {
    let { page = 1 } = req.query;

    if (page <= 0) {
      page = 1;
    }

    const count = await Comunicados.count();

    const comunicados = await Comunicados.findAll({
      attributes: ["id", "titulo", "conteudo", "created_at"],
      include: { association: "usuario", attributes: ["id", "nome_completo"] },
      order: [["created_at", "DESC"]],
      limit: 5,
      offset: (page - 1) * 5,
    });

    res.header("X-Total-Count", count);

    return res.json({ comunicados });
  }

  async store(req, res) {
    const { titulo, conteudo } = req.body;
    const { tipo_usuario, usuario_id } = req;

    if (tipo_usuario === "ADMIN" || tipo_usuario === "PROFESSOR_ADMIN") {
      if (!titulo) {
        return res
          .status(400)
          .json({ message: "O titulo do comunicado é obrigatorio" });
      }

      try {
        const comunicado = await Comunicados.create({
          titulo,
          conteudo,
          criado_por: usuario_id,
        });

        return res.status(201).json({ comunicado });
      } catch (error) {
        return res.status(409).json({
          message: "Ja existe um comunicado com esse titulo",
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }
  }

  async update(req, res) {
    const { comunicado_id } = req.params;
    const { titulo, conteudo } = req.body;
    const { tipo_usuario } = req;

    if (tipo_usuario === "ADMIN" || tipo_usuario === "PROFESSOR_ADMIN") {
      try {
        const comunicado = await Comunicados.findByPk(comunicado_id);

        if (!comunicado) {
          return res
            .status(404)
            .json({ message: "Comunicado nao encontrado!" });
        }

        await comunicado.update({ titulo, conteudo });

        return res.json({ comunicado });
      } catch (error) {
        return res.status(409).json({
          message: "Erro ao atualizar o comunicado",
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }
  }

  async destroy(req, res) {
    const { comunicado_id } = req.params;
    const { tipo_usuario } = req;

    if (tipo_usuario === "ADMIN" || tipo_usuario === "PROFESSOR_ADMIN") {
      try {
        const comunicado = await Comunicados.findByPk(comunicado_id);

        if (!comunicado) {
          return res
            .status(404)
            .json({ message: "Comunicado nao encontrado!" });
        }

        await comunicado.destroy();

        return res.json();
      } catch (error) {
        return res.status(409).json({
          message: "Erro ao deletar o comunicado",
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }
  }
}

module.exports = new ComunicadosController();
