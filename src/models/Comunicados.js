const crypto = require("crypto");
const { Model, DataTypes } = require("sequelize");

class Comunicados extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        titulo: DataTypes.STRING,
        conteudo: DataTypes.TEXT,
      },
      {
        sequelize,
        hooks: {
          beforeCreate: (comunicado, _) => {
            comunicado.id = crypto.randomBytes(16).toString("base64url");
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

module.exports = Comunicados;
