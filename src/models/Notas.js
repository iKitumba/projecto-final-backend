const crypto = require("crypto");
const { Model, DataTypes } = require("sequelize");

class Notas extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        trimestre: {
          type: DataTypes.ENUM("PRIMEIRO", "SEGUNDO", "TERCEIRO"),
          allowNull: false,
        },
        nota_1: {
          type: DataTypes.TINYINT(2),
          validate: {
            min: 0,
            max: 20,
          },
          defaultValue: 0,
        },
        nota_2: {
          type: DataTypes.TINYINT(2),
          validate: {
            min: 0,
            max: 20,
          },
          defaultValue: 0,
        },
        nota_3: {
          type: DataTypes.TINYINT(2),
          validate: {
            min: 0,
            max: 20,
          },
          defaultValue: 0,
        },
        media: {
          type: DataTypes.VIRTUAL,
          get() {
            return Math.round((this.nota_1 + this.nota_2 + this.nota_3) / 3);
          },
        },
      },
      {
        sequelize,
        hooks: {
          beforeCreate: (nota, _) => {
            nota.id = crypto.randomBytes(16).toString("base64url");
          },
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Alunos, {
      foreignKey: "aluno_id",
      as: "aluno",
    });
    this.belongsTo(models.Disciplinas, {
      foreignKey: "disciplina_id",
      as: "disciplina",
    });
  }
}

module.exports = Notas;
