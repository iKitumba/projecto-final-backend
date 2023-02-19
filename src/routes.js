const { Router } = require("express");
const multer = require("multer");
const UsuariosController = require("./controllers/UsuariosController");
const SessaoController = require("./controllers/SessaoController");
const CursosController = require("./controllers/CursosController");
const TurmasController = require("./controllers/TurmasController");
const DisciplinasController = require("./controllers/DisciplinasController");
const ComunicadosController = require("./controllers/ComunicadosController");
const ProfessorDisciplinaController = require("./controllers/ProfessorDisciplinaController");
const ProfessorController = require("./controllers/ProfessorController");
const AlunosController = require("./controllers/AlunosController");
const RelatorioController = require("./controllers/RelatorioController");
const AlunosSessaoController = require("./controllers/AlunosSessaoController");
const ResetAlunoPasswordController = require("./controllers/ResetAlunoPasswordController");
const AlterarUsuarioSenhaController = require("./controllers/AlterarUsuarioSenhaController");
const AlunoAproveitamentoController = require("./controllers/AlunoAproveitamentoController");
const ProfessorTurmasController = require("./controllers/ProfessorTurmasController");
const TurmasProfessoresController = require("./controllers/TurmaProfessoresController");

const authMiddleware = require("./middlewares/auth");

const uploadConfig = require("./config/upload");
const NotasController = require("./controllers/NotasController");

const routes = Router();

routes.post("/alunos_sessao", AlunosSessaoController.store);
routes.post("/usuarios/sessao", SessaoController.store);
routes.get("/professores", authMiddleware, UsuariosController.index);
routes.post(
  "/usuarios",
  authMiddleware,
  multer(uploadConfig).single("foto_perfil"),
  UsuariosController.store
);

/**
 * Rotas sobre Cursos
 */

routes.get("/cursos", CursosController.index);
routes.post("/cursos", authMiddleware, CursosController.store);

routes.get("/turmas", TurmasController.index);
routes.post("/cursos/:curso_id/turmas", authMiddleware, TurmasController.store);
routes.get("/turmas/:turma_id", authMiddleware, TurmasController.show);

routes.get(
  "/turmas/:turma_id/professores",
  authMiddleware,
  TurmasProfessoresController.show
);

routes.get("/disciplinas", DisciplinasController.index);
routes.post("/disciplinas", authMiddleware, DisciplinasController.store);

routes.get("/comunicados", ComunicadosController.index);
routes.post("/comunicados", authMiddleware, ComunicadosController.store);
routes.patch(
  "/comunicados/:comunicado_id",
  authMiddleware,
  ComunicadosController.update
);
routes.delete(
  "/comunicados/:comunicado_id",
  authMiddleware,
  ComunicadosController.destroy
);

routes.get(
  "/professores_disciplinas_turmas",
  authMiddleware,
  ProfessorDisciplinaController.index
);

routes.post(
  "/professores/:professor_id/disciplinas/:disciplina_id/turmas/:turma_id",
  authMiddleware,
  ProfessorDisciplinaController.store
);

routes.get("/professores/dashboard", authMiddleware, ProfessorController.show);

routes.get("/turmas/:turma_id/alunos", authMiddleware, AlunosController.index);
routes.post(
  "/turmas/:turma_id/alunos",
  authMiddleware,
  multer(uploadConfig).single("foto_perfil"),
  AlunosController.store
);

routes.get("/alunos/:aluno_id/notas", NotasController.index);
routes.get("/alunos/:aluno_id", authMiddleware, AlunosController.show);
routes.post(
  "/disciplinas/:disciplina_id/alunos/:aluno_id/notas",
  authMiddleware,
  NotasController.store
);

routes.patch("/notas/:nota_id", authMiddleware, NotasController.update);

routes.patch(
  "/alunos/senha/alterar",
  authMiddleware,
  ResetAlunoPasswordController.update
);

routes.patch(
  "/usuarios/senha/alterar",
  authMiddleware,
  AlterarUsuarioSenhaController.update
);

routes.get(
  "/alunos/:aluno_id/aproveitamento",
  authMiddleware,
  AlunoAproveitamentoController.show
);

routes.get(
  "/professores/turmas",
  authMiddleware,
  ProfessorTurmasController.index
);

/**
 * Relatório sobre as turmas
 */

routes.get("/relatorio/turmas", authMiddleware, RelatorioController.index);

module.exports = routes;
