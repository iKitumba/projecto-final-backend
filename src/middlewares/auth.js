const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Nenhum token providenciado" });
  }

  const parts = authHeader.split(" ");

  if (!parts.length === 2) {
    return res.json(401).json({ message: "Erro no token" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: "Token malformatado" });
  }

  jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalido" });
    }

    req.usuario_id = decoded.id;

    if (decoded.tipo_usuario) {
      req.tipo_usuario = decoded.tipo_usuario;
    }

    next();
  });
};
