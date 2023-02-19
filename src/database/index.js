const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const Usuarios = require("../models/Usuarios");
const Cursos = require("../models/Cursos");
const Turmas = require("../models/Turmas");
const Disciplinas = require("../models/Disciplinas");
const Comunicados = require("../models/Comunicados");
const Alunos = require("../models/Alunos");
const Notas = require("../models/Notas");
const AssociacaoPDT = require("../models/AssociacaoPDT");

const connection = new Sequelize(dbConfig);

Usuarios.init(connection);
Cursos.init(connection);
Turmas.init(connection);
Disciplinas.init(connection);
Comunicados.init(connection);
Alunos.init(connection);
Notas.init(connection);
AssociacaoPDT.init(connection);

Cursos.associate(connection.models);
Turmas.associate(connection.models);
Disciplinas.associate(connection.models);
Comunicados.associate(connection.models);
Alunos.associate(connection.models);
Notas.associate(connection.models);
AssociacaoPDT.associate(connection.models);

module.exports = connection;
