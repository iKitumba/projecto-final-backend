"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("turmas", {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      letra: {
        type: Sequelize.STRING(1),
        upperCase: true,
      },
      turno: {
        type: Sequelize.ENUM("MANHA", "TARDE", "NOITE"),
        allowNull: false,
      },
      classe: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      curso_id: {
        type: Sequelize.STRING,
        references: { model: "cursos", key: "id" },
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
    return queryInterface.dropTable("turmas");
  },
};
