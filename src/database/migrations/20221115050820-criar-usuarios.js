"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("usuarios", {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        lowerCase: true,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nome_completo: {
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
      telefone: {
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
      tipo_usuario: {
        type: Sequelize.ENUM("ADMIN", "PROFESSOR", "PROFESSOR_ADMIN"),
        allowNull: false,
        default: "PROFESSOR",
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
    return queryInterface.dropTable("usuarios");
  },
};
