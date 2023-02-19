const Usuarios = require("../models/Usuarios");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

class SessionController {
  async store(req, res) {
    const { username, senha } = req.body;
    const usuario = await Usuarios.findOne({ where: { username } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }

    if (!(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    usuario.senha = undefined;

    const token = generateToken({
      id: usuario.id,
      tipo_usuario: usuario.tipo_usuario,
    });

    return res.json({ usuario, token });
  }
}

module.exports = new SessionController();
