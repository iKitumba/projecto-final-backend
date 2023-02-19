module.exports = {
  GET_PROFESSOR_DISCIPLINA_TURMA_ALL_DATA:
    "SELECT professor_disciplina_turma.id AS pdt_id, professor_disciplina_turma.professor_id, professor_disciplina_turma.disciplina_id, professor_disciplina_turma.turma_id, turmas.letra AS t_letra, turmas.classe AS t_classe, turmas.turno AS t_turno, cursos.id AS c_id, cursos.titulo AS c_titulo, cursos.diminuitivo AS c_diminuitivo, usuarios.nome_completo AS p_nome_completo, usuarios.genero AS p_genero, usuarios.telefone AS p_telefone, disciplinas.titulo AS d_titulo, disciplinas.diminuitivo AS d_diminuitivo FROM professor_disciplina_turma INNER JOIN turmas ON professor_disciplina_turma.turma_id = turmas.id INNER JOIN cursos ON turmas.curso_id = cursos.id INNER JOIN usuarios ON professor_disciplina_turma.professor_id = usuarios.id INNER JOIN disciplinas ON professor_disciplina_turma.disciplina_id = disciplinas.id;",
  GET_A_PROFESSOR_DISCIPLINA_TURMA:
    "SELECT * FROM professor_disciplina_turma WHERE professor_id = ? AND disciplina_id = ? AND turma_id = ?",
  INSERT_A_PROFESSOR_DISCIPLINA_TURMA:
    "INSERT INTO professor_disciplina_turma(id, professor_id, disciplina_id, turma_id) VALUES(?, ?, ?, ?)",
};
