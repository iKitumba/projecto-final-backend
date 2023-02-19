const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { Model, DataTypes } = require("sequelize");

class Alunos extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome_completo: DataTypes.STRING,
        nome_pai: DataTypes.STRING,
        nome_mae: DataTypes.STRING,
        genero: {
          type: DataTypes.ENUM("M", "F"),
          allowNull: false,
          default: "F",
        },
        foto_perfil: DataTypes.STRING,
        telefone_1: DataTypes.STRING(20),
        telefone_2: DataTypes.STRING(20),
        bi: DataTypes.STRING(14),
        endereco: DataTypes.STRING,
        nascimento: DataTypes.DATE,
        senha: {
          type: DataTypes.STRING,
          defaultValue: "999",
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
          async beforeCreate(aluno, _) {
            aluno.senha = await bcrypt.hash(aluno.senha, 10);
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

    this.belongsTo(models.Turmas, { foreignKey: "turma_id", as: "turma" });
    this.hasMany(models.Notas, { foreignKey: "aluno_id", as: "notas" });
  }
}

module.exports = Alunos;
