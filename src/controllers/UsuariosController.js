const Usuarios = require("../models/Usuarios");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const userTypes = require("../constants/tiposUsuario");
const generoTypes = require("../constants/tiposGeneros");

class UsuariosController {
  async index(req, res) {
    const tipo_usuario = req.tipo_usuario;

    if (tipo_usuario === "ADMIN" || tipo_usuario === "PROFESSOR_ADMIN") {
      const professores = await Usuarios.findAll({
        attributes: [
          "id",
          "telefone",
          "genero",
          "nome_completo",
          "foto_perfil",
          "foto_perfil_url",
        ],
        where: {
          [Op.or]: [
            { tipo_usuario: "PROFESSOR" },
            { tipo_usuario: "PROFESSOR_ADMIN" },
          ],
        },
      });

      return res.json({ professores });
    } else {
      return res
        .status(401)
        .json({ message: "Nao pode realizar essa operacao" });
    }
  }

  async store(req, res) {
    const {
      username,
      senha,
      nome_completo,
      genero,
      telefone,
      bi,
      endereco,
      tipo_usuario,
    } = req.body;
    const { filename: foto_perfil } = req.file;

    if (
      req.tipo_usuario === "ADMIN" ||
      req.tipo_usuario === "PROFESSOR_ADMIN"
    ) {
      if (
        !userTypes.includes(tipo_usuario) ||
        !generoTypes.includes(String(genero).toUpperCase())
      ) {
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
            return res
              .status(400)
              .send({ message: "Tipo de usuario invalido ou genero" });
          }
        );
      }

      try {
        const usuario = await Usuarios.create({
          username: username.toLowerCase(),
          senha,
          nome_completo,
          genero: genero.toUpperCase(),
          foto_perfil,
          telefone,
          bi,
          endereco,
          tipo_usuario,
        });

        usuario.senha = undefined;

        return res.status(201).json({ usuario });
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
              message: `Ja existe um usuario com esse username (${username})`,
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

module.exports = new UsuariosController();
