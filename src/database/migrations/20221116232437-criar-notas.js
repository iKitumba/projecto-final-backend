"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("notas", {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      disciplina_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "disciplinas", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      trimestre: {
        type: Sequelize.ENUM("PRIMEIRO", "SEGUNDO", "TERCEIRO"),
        allowNull: false,
      },
      nota_1: {
        type: Sequelize.TINYINT(2),
      },
      nota_2: {
        type: Sequelize.TINYINT(2),
      },
      nota_3: {
        type: Sequelize.TINYINT(2),
      },
      aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "alunos", key: "id" },
        onDelete: "CASCADE",
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
    return queryInterface.dropTable("notas");
  },
};
