//importando pacote mysql
import mysql from 'mysql2/promise';

//importando configurações do banco
import db from '../conexao.js';

//Cadastrando hóspede
export async function createHospede(hospede) {
  const conexao = mysql.createPool(db);
  const sql = `INSERT INTO hospedes 
          (nome_hospede, cpf, rg, data_nascimento, sexo, profissao, observacoes, rua, numero, cidade, estado, cep, bairro, complemento, observacoes_endereco, email, celular) 
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  const params = [
    hospede.nome_hospede,
    hospede.cpf,
    hospede.rg,
    hospede.data_nascimento,
    hospede.sexo,
    hospede.profissao,
    hospede.observacoes,
    hospede.rua,
    hospede.numero,
    hospede.cidade,
    hospede.estado,
    hospede.cep,
    hospede.bairro,
    hospede.complemento,
    hospede.observacoes_endereco,
    hospede.email,
    hospede.celular,
  ];

  try {
    const [retorno] = await conexao.query(sql, params);
    console.log('Hóspede Cadastrado');
    return [201, retorno];
  } catch (mensagem) {
    console.log(mensagem);
    return [500, mensagem];
  }
}

export async function readHospedes() {
  console.log('HospedeModel: readHospedes');
  const conexao = mysql.createPool(db);

  const sql = 'SELECT * FROM hospedes';

  try {
    const [retorno] = await conexao.query(sql);
    console.log('Listando Hóspedes');
    return [200, retorno];
  } catch (error) {
    console.log(error);
    return [500, { message: 'Erro ao recuperar hóspedes', error }];
  }
}

export async function getOneHospede(id) {
  console.log('HospedeModel: getOneHospede');
  const conexao = mysql.createPool(db);
  const sql = 'SELECT * FROM hospedes WHERE id_hospede = ?';
  const params = [id];

  try {
    const [retorno] = await conexao.query(sql, params);
    console.log('Mostrando Hospede');
    console.log(retorno);
    if (retorno.length < 1) {
      return [404, { mensagem: 'Hóspede não encontrado' }];
    }

    return [200, retorno[0]];
  } catch (error) {
    console.error(error);
    return [500, error];
  }
}

export async function updateHospede(hospede, id_hospede) {
  console.log('HospedeModel: updateHospede');
  const conexao = mysql.createPool(db);
  const sql = `
  UPDATE hospedes SET 
      nome_hospede = ?, 
      cpf = ?, 
      rg = ?, 
      data_nascimento = ?, 
      sexo = ?, 
      profissao = ?, 
      observacoes = ?, 
      rua = ?, 
      numero = ?, 
      cidade = ?, 
      estado = ?, 
      cep = ?, 
      bairro = ?, 
      complemento = ?, 
      observacoes_endereco = ?, 
      email = ?, 
      celular = ? 
  WHERE id_hospede = ?;
`;

const params = [
  hospede.nome_hospede,
  hospede.cpf,
  hospede.rg,
  hospede.data_nascimento,
  hospede.sexo,
  hospede.profissao,
  hospede.observacoes,
  hospede.rua,
  hospede.numero,
  hospede.cidade,
  hospede.estado,
  hospede.cep,
  hospede.bairro,
  hospede.complemento,
  hospede.observacoes_endereco,
  hospede.email,
  hospede.celular,
  id_hospede
];


  try {
    const [retorno] = await conexao.query(sql, params);
    console.log('Atualizando Hóspede');
    if (retorno.affectedRows < 1) {
      return [404, { message: 'Hóspede não encontrado' }];
    }
    return [200, { message: 'Hóspede Atualizado' }];
  } catch (error) {
    console.log(error);
    return [500, error];
  }
}

export async function deleteHospede(id) {
  console.log('HospedeModel: deleteHospede');
  const conexao = mysql.createPool(db);
  const sql = 'DELETE FROM hospedes WHERE id_hospede = ?'; // Verifique se 'id' é o nome correto da coluna
  const params = [id];

  try {
    const [retorno] = await conexao.query(sql, params);
    console.log('Deletando Hóspede');

    if (retorno.affectedRows < 1) {
      return [404, { message: 'Hóspede não encontrado' }];
    }

    return [200, { message: 'Hóspede deletado com sucesso' }];
  } catch (error) {
    console.log(error);
    return [500, { message: 'Erro ao deletar hóspede', error }];
  }
}

// Função para verificar se um CPF já existe no banco de dados
export async function verificarCPF(cpf) {
  console.log('HospedeModel: verificarCPF');
  const conexao = mysql.createPool(db);
  const sql = 'SELECT id_hospede, nome_hospede FROM hospedes WHERE cpf = ?';
  const params = [cpf];

  try {
    const [retorno] = await conexao.query(sql, params);
    console.log('Verificando CPF');
    
    if (retorno.length > 0) {
      // CPF encontrado - hospede já existe
      return [200, { existe: true, hospede: retorno[0] }];
    }
    
    // CPF não encontrado
    return [200, { existe: false }];
  } catch (error) {
    console.log(error);
    return [500, { message: 'Erro ao verificar CPF', error }];
  }
}
