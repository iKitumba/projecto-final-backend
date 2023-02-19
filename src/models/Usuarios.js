const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { Model, DataTypes } = require("sequelize");

class Usuarios extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        username: DataTypes.STRING(20),
        senha: DataTypes.STRING,
        nome_completo: DataTypes.STRING,
        foto_perfil: DataTypes.STRING,
        telefone: DataTypes.STRING(20),
        bi: DataTypes.STRING(14),
        endereco: DataTypes.STRING,
        genero: {
          type: DataTypes.ENUM("M", "F"),
          allowNull: false,
          default: "F",
        },
        tipo_usuario: {
          type: DataTypes.ENUM("ADMIN", "PROFESSOR", "PROFESSOR_ADMIN"),
          allowNull: false,
          default: "PROFESSOR",
        },
        foto_perfil_url: {
          type: DataTypes.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/fotos/${this.foto_perfil}`;
          },
        },
      },
      {
        sequelize,
        hooks: {
          beforeCreate: async (usuario, _) => {
            usuario.senha = await bcrypt.hash(usuario.senha, 10);
            usuario.id = crypto.randomBytes(16).toString("base64url");
          },
        },
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.Disciplinas, {
      foreignKey: "professor_id",
      through: "professor_disciplina_turma",
      as: "disciplinas",
    });

    this.belongsToMany(models.Turmas, {
      foreignKey: "professor_id",
      through: "professor_disciplina_turma",
      as: "turmas",
    });
  }
}

module.exports = Usuarios;
