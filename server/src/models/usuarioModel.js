import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import db from '../conexao.js';

export async function createUsuario(req, res) {
  const { login, senha, id_funcionario } = req.body;

  try {
    // Verificar se o funcionário existe
    const [funcionario] = await pool.query('SELECT * FROM funcionarios WHERE id_funcionario = ?', [id_funcionario]);

    if (funcionario.length === 0) {
      return res.status(400).json({ error: "Funcionário não encontrado." });
    }

    // Hash da senha antes de inserir
    const hashSenha = await bcrypt.hash(senha, 10);

    // Inserir o novo usuário
    const [resultado] = await pool.query(
      'INSERT INTO usuarios (login, senha, id_funcionario) VALUES (?, ?, ?)',
      [login, hashSenha, id_funcionario]
    );

    return res.status(201).json({ message: "Usuário criado com sucesso!", id: resultado.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar usuário", details: error.message });
  }
}


export async function readUsuario() {
  console.log('UsuarioModel : readUsuario');
  const conexao = mysql.createPool(db);
  const sql = 'SELECT * FROM usuarios';

  try {
    const [resposta] = await conexao.query(sql);
    return [200, resposta]; // Retorna o status e a resposta para o controlador
  } catch (error) {
    console.log(error);
    return [500, { message: 'Erro ao Exibir Usuários', details: error.message }]; // Retorna o status e a mensagem de erro
  }
}

export async function showOneUsuario(req, res) {
  console.log('UsuarioController :: showOneUsuario');
  const conexao = mysql.createPool(db);
  const sql = 'SELECT * FROM usuarios WHERE id_usuario = ?';
  const params = [req.params.id_usuario];

  try {
    const [resposta] = await conexao.query(sql, params);
    if (resposta.length < 1) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    } else {
      return res.status(200).json(resposta[0]);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Erro ao exibir usuário', details: error.message });
  }
}

export async function updateUsuario(req, res) {
  console.log('UsuarioController :: updateUsuario');
  const { login, senha } = req.body;
  const { id_usuario } = req.params;

  try {
    // Hash da senha antes de atualizar
    const hashSenha = await bcrypt.hash(senha, 10);

    const conexao = mysql.createPool(db);
    const sql = 'UPDATE usuarios SET login = ?, senha = ? WHERE id_usuario = ?';
    const params = [login, hashSenha, id_usuario];

    const [resposta] = await conexao.query(sql, params);
    if (resposta.affectedRows < 1) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    } else {
      return res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Erro ao editar usuário', details: error.message });
  }
}

export async function deleteUsuario(req, res) {
  console.log('UsuarioController :: deleteUsuario');
  const { id_usuario } = req.params;

  try {
    const conexao = mysql.createPool(db);
    const sql = 'DELETE FROM usuarios WHERE id_usuario = ?';
    const params = [id_usuario];

    const [resposta] = await conexao.query(sql, params);
    if (resposta.affectedRows < 1) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    } else {
      return res.status(200).json({ message: 'Usuário deletado com sucesso' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Erro ao deletar usuário', details: error.message });
  }
}

export async function getUserByLoginPassword(cpf) {
  console.log('UsuarioController :: getUserByLoginPassword');
  
  try {
    // Criar a conexão com o banco de dados
    const conexao = mysql.createPool(db);

    // Buscar o funcionário pelo CPF
    const sql = 'SELECT id_funcionario, nome_funcionario, cpf, cargo FROM funcionarios WHERE cpf = ?';
    const params = [cpf];

    const [resposta] = await conexao.query(sql, params);

    console.log("resposta backend",resposta)

    // Verificar se o funcionário foi encontrado
    if (resposta.length < 1) {
      // Mensagem genérica para evitar a exposição de informações
      return [401, { message: 'Credenciais inválidas' }];
    }

    console.log('Usuário autenticado com sucesso:', resposta[0].id_funcionario);

    // Retornar sucesso com as informações do funcionário
    return [200, {
      id_funcionario: resposta[0].id_funcionario,
      nome_funcionario: resposta[0].nome_funcionario,
      cpf: resposta[0].cpf,
      cargo: resposta[0].cargo
    }];
  } catch (error) {
    console.log('Erro ao realizar login:', error);
    return [500, { message: 'Erro ao realizar login', details: error.message }];
  }
}

