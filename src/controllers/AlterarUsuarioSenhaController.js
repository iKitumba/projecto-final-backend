const Usuarios = require("../models/Usuarios");
const bcrypt = require("bcryptjs");

class AlterarUsuarioSenhaController {
  async update(req, res) {
    const { senha_antiga, nova_senha } = req.body;
    const { usuario_id } = req;
    const usuario = await Usuarios.findOne({ where: { id: usuario_id } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }

    if (!(await bcrypt.compare(senha_antiga, usuario.senha))) {
      return res.status(401).json({ message: "Senha atual incorreta" });
    }

    usuario.senha = await bcrypt.hash(nova_senha, 10);

    await usuario.save();

    usuario.senha = undefined;

    return res.json({ message: "Senha alterada com sucesso!" });
  }
}

module.exports = new AlterarUsuarioSenhaController();
