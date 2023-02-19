const crypto = require("crypto");
const { Model, DataTypes } = require("sequelize");

class AssociacaoPDT extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: "professor_disciplina_turma",
        hooks: {
          beforeCreate: (associadoPDT, _) => {
            associadoPDT.id = crypto.randomBytes(16).toString("base64url");
          },
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Usuarios, {
      foreignKey: "professor_id",
      as: "professor",
    });

    this.belongsTo(models.Turmas, {
      foreignKey: "turma_id",
      as: "turma",
    });

    this.belongsTo(models.Disciplinas, {
      foreignKey: "disciplina_id",
      as: "disciplina",
    });
  }
}

module.exports = AssociacaoPDT;
