//importando pacote mysql
import mysql from 'mysql2/promise';

//importando configurações do banco
import db from '../conexao.js';

// Cadastrando Funcionario
export async function createFuncionario(funcionario) {
    const conexao = mysql.createPool(db);

    const sqlFuncionario = `INSERT INTO funcionarios 
        (nome_funcionario, rg, cpf, data_nascimento, sexo, email, telefone, observacoes, 
        cep, estado, cidade, bairro, logradouro, numero, complemento, observacoes_endereco,
        cargo, data_admissao, data_emissao_carteira, banco, agencia, conta, status_funcionario, observacoes_adicionais, 
        senha) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    // Gerando senha padrão (CPF sem criptografia) - Substituir por hash em produção
    const senha = funcionario.cpf;

    const paramsFuncionario = [
        funcionario.nome_funcionario,
        funcionario.rg,
        funcionario.cpf,
        funcionario.dataNascimento,
        funcionario.sexo,
        funcionario.email,
        funcionario.telefone,
        funcionario.observacoes,
        funcionario.cep,
        funcionario.estado,
        funcionario.cidade,
        funcionario.bairro,
        funcionario.logradouro,
        funcionario.numero,
        funcionario.complemento,
        funcionario.observacoesEndereco,
        funcionario.cargo,
        funcionario.dataAdmissao,
        funcionario.dataEmissaoCarteira,
        funcionario.banco,
        funcionario.agencia,
        funcionario.conta,
        funcionario.statusFuncionario,
        funcionario.observacoesAdicionais,
        senha
    ];

    try {
        console.log('Tentando cadastrar funcionário:', paramsFuncionario);

        const connection = await conexao.getConnection();
        try {
            await connection.beginTransaction();

            // Inserção na tabela
            const [resultadoFuncionario] = await connection.query(sqlFuncionario, paramsFuncionario);
            const idFuncionario = resultadoFuncionario.insertId;

            await connection.commit();

            console.log('Funcionário cadastrado com sucesso, ID:', idFuncionario);
            return [201, { mensagem: 'Funcionário cadastrado com sucesso', id: idFuncionario }];
        } catch (error) {
            await connection.rollback();
            console.error('Erro ao realizar cadastro:', error);
            return [400, { mensagem: 'Erro ao cadastrar funcionário', detalhes: error.message }];
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Erro na conexão com o banco:', error);
        return [500, { mensagem: 'Erro interno ao processar o cadastro', detalhes: error.message }];
    }
}

  export async function readFuncionario() {
    console.log("FuncionarioModel: readFuncionario");
    const conexao = mysql.createPool(db);

    const sql = 'SELECT * FROM funcionarios';

    try {
        const [retorno] = await conexao.query(sql);
        console.log("Mostrando Funcionarios");
        return [200, retorno];
    } catch (error) {
        console.log(error);
        return [500, error];
    }
}


// buscando um Funcionario
export async function getOneFuncionario(id) {
  console.log("FuncionarioModel: getOneFuncionario");
  const conexao = mysql.createPool(db);
  const sql = 'SELECT * FROM funcionarios WHERE id_funcionario = ?';
  const params = [id];

  try {
      const [retorno] = await conexao.query(sql, params);
      console.log("Mostrando Funcionario");
      console.log(retorno);
      if (retorno.length < 1) {
          return [404, { mensagem: "Funcionario não encontrado" }];
      }
      
      return [200, retorno[0]];
  } catch (error) {
      console.error(error);
      return [500, error];
  }
}


// Editando funcionario

export async function updateFuncionario(funcionario, id) {
    console.log("FuncionarioModel: updateFuncionario");
    console.log('Dados recebidos para atualização:', funcionario);
  
    // Criação da conexão com o banco de dados
    const conexao = mysql.createPool(db);
  
    // Consulta SQL corrigida
    const sql = `UPDATE funcionarios SET 
            nome_funcionario = ?, 
            rg = ?, 
            cpf = ?, 
            data_nascimento = ?, 
            sexo = ?, 
            email = ?, 
            telefone = ?, 
            observacoes = ?, 
            cep = ?, 
            estado = ?,  -- Corrigido: estado em minúsculo
            cidade = ?, 
            bairro = ?, 
            logradouro = ?, 
            numero = ?, 
            complemento = ?, 
            observacoes_endereco = ?, -- Corrigido: nome do campo correto
            cargo = ?, 
            data_admissao = ?, 
            data_emissao_carteira = ?, 
            banco = ?, 
            agencia = ?, 
            conta = ?, 
            status_funcionario = ?, -- Corrigido: nome do campo correto
            observacoes_adicionais = ? 
            WHERE id_funcionario = ?`;
  
    // Array de parâmetros corrigido
    const params = [
      funcionario.nome_funcionario,
      funcionario.rg,
      funcionario.cpf,
      funcionario.data_nascimento,
      funcionario.sexo,
      funcionario.email,
      funcionario.telefone,
      funcionario.observacoes,
      funcionario.cep,
      funcionario.estado, // Certifique-se de que o campo no objeto é 'estado'
      funcionario.cidade,
      funcionario.bairro,
      funcionario.logradouro,
      funcionario.numero,
      funcionario.complemento,
      funcionario.observacoes_endereco, // Corrigido para usar o nome correto
      funcionario.cargo,
      funcionario.data_admissao, // Corrigido para usar o nome correto
      funcionario.data_emissao_carteira, // Corrigido para usar o nome correto
      funcionario.banco,
      funcionario.agencia,
      funcionario.conta,
      funcionario.status_funcionario, // Corrigido para usar o nome correto
      funcionario.observacoes_adicionais, // Corrigido para usar o nome correto
      id, // ID correto passado como último parâmetro
    ];
  
    try {
      // Depuração para verificar SQL e parâmetros
      console.log('SQL:', sql);
      console.log('Parâmetros:', params);
  
      const [retorno] = await conexao.query(sql, params);
      console.log("Atualizando Funcionario");
  
      // Verificação se o registro foi atualizado
      if (retorno.affectedRows < 1) {
        return [404, { mensagem: "Funcionario não encontrado" }];
      }
  
      return [200, { mensagem: "Funcionario atualizado" }];
    } catch (error) {
      // Log detalhado do erro
      console.error('Erro ao atualizar funcionário:', error);
      return [500, error];
    }
  }
  
