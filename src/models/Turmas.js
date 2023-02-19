const crypto = require("crypto");
const { Model, DataTypes } = require("sequelize");

class Turmas extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        letra: DataTypes.STRING(1),
        turno: DataTypes.ENUM("MANHA", "TARDE", "NOITE"),
        classe: DataTypes.STRING(3),
      },
      {
        sequelize,
        hooks: {
          beforeCreate: (turma, _) => {
            turma.id = crypto.randomBytes(16).toString("base64url");
          },
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Cursos, { foreignKey: "curso_id", as: "curso" });
    this.belongsTo(models.Usuarios, {
      foreignKey: "criado_por",
      as: "usuario",
    });

    this.belongsToMany(models.Usuarios, {
      foreignKey: "turma_id",
      through: "professor_disciplina_turma",
      as: "professores",
    });

    this.belongsToMany(models.Disciplinas, {
      foreignKey: "turma_id",
      through: "professor_disciplina_turma",
      as: "disciplinas",
    });

    this.hasMany(models.Alunos, { foreignKey: "turma_id", as: "alunos" });
  }
}

module.exports = Turmas;
