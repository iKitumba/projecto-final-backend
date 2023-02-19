const crypto = require("crypto");
const { Model, DataTypes } = require("sequelize");

class Cursos extends Model {
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
          beforeCreate: (curso, _) => {
            curso.id = crypto.randomBytes(16).toString("base64url");
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
  }
}

module.exports = Cursos;
