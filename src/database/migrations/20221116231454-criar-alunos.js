"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("alunos", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      nome_completo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nome_pai: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nome_mae: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      genero: {
        type: Sequelize.ENUM("M", "F"),
        allowNull: false,
        default: "F",
      },
      foto_perfil: {
        type: Sequelize.STRING,
      },
      telefone_1: {
        type: Sequelize.STRING(20),
      },
      telefone_2: {
        type: Sequelize.STRING(20),
      },
      bi: {
        type: Sequelize.STRING(14),
        allowNull: false,
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nascimento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      turma_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "turmas", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      criado_por: {
        type: Sequelize.STRING,
        references: { model: "usuarios", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("alunos");
  },
};
