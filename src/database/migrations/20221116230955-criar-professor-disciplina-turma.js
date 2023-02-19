"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("professor_disciplina_turma", {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      professor_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "usuarios", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      disciplina_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "disciplinas", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      turma_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "turmas", key: "id" },
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
    return queryInterface.dropTable("professor_disciplina_turma");
  },
};
