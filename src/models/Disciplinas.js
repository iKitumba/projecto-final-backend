const crypto = require("crypto");
const { Model, DataTypes } = require("sequelize");

class Disciplinas extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        titulo: DataTypes.STRING,
        diminuitivo: DataTypes.STRING(10),
      },
      {
        sequelize,
        hooks: {
          beforeCreate: (disciplina, _) => {
            disciplina.id = crypto.randomBytes(16).toString("base64url");
          },
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Usuarios, {
      foreignKey: "criado_por",
      as: "usuario",
    });

    this.belongsToMany(models.Usuarios, {
      foreignKey: "disciplina_id",
      through: "professor_disciplina_turma",
      as: "professores",
    });

    this.belongsToMany(models.Turmas, {
      foreignKey: "disciplina_id",
      through: "professor_disciplina_turma",
      as: "turmas",
    });
  }
}

module.exports = Disciplinas;
