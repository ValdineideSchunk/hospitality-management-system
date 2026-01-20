// Importando pacote mysql
import mysql from 'mysql2/promise';

// Importando configurações do banco
import db from '../conexao.js';

// Cadastrando reserva
export async function createReserva(reserva) {
  console.log("Dados recebidos para cadastro da reserva:", reserva);
  const conexao = mysql.createPool(db);
  const sql = `INSERT INTO reservas 
  (status_reserva, fk_hospede, fk_acomodacao, data_checkin, data_checkout, valor_diaria, numero_adulto, numero_crianca, observacoes, pago, quantidade_diarias, valor_total) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


    const params = [
      reserva.status_reserva,           
      reserva.fk_hospede,            
      reserva.fk_acomodacao,      
      reserva.data_checkin,       
      reserva.data_checkout,          
      reserva.valor_diaria,        
      reserva.numero_adulto,         
      reserva.numero_crianca,        
      reserva.observacoes,
      reserva.pago,
      reserva.quantidade_diarias,  
      reserva.valor_total          
    ];
    

  try {
    const [retorno] = await conexao.query(sql, params);
    console.log('Reserva cadastrada');
    return [201, retorno];
  } catch (error) {
    console.error('Erro ao cadastrar reserva:', error);
    return [500, error];
  }
}

// Lendo Reservas
export async function readReservas() {
    console.log("ReservaModel: readReservas");
    const conexao = mysql.createPool(db);

    const sql = 'SELECT * FROM view_informacoes_reserva';

    try {
        const [retorno] = await conexao.query(sql);
        console.log("Mostrando Reservas",retorno);
        return [200, retorno];
    } catch (error) {
        console.log(error);
        return [500, error];
    }
}


// Buscando uma reserva específica pelo ID
export async function getOneReserva(id) {
  console.log('ReservaModel: getOneReserva');
  const conexao = mysql.createPool(db);
  const sql = 'SELECT * FROM reservas WHERE id_reserva = ?';
  const params = [id];

  try {
    const [retorno] = await conexao.query(sql, params);
    console.log('Mostrando reserva');
    if (retorno.length < 1) {
      return [404, { mensagem: 'Reserva não encontrada' }];
    }

    return [200, retorno[0]];
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    return [500, error];
  }
}

// atualizando reserva
export async function updateReserva(reserva, id) {
  console.log("ReservaModel: updateReserva");
  console.log('Dados recebidos para atualização:', reserva);
  const conexao = mysql.createPool(db);
  // Verifica se o campo observacoes está vazio, e se sim, substitui por null
  const observacoes = reserva.observacoes && reserva.observacoes.trim() !== "" 
                        ? reserva.observacoes 
                        : null;
  const sql = `UPDATE reservas SET 
      status_reserva = ?, 
      fk_hospede = ?, 
      fk_acomodacao = ?, 
      data_checkin = ?, 
      data_checkout = ?, 
      valor_diaria = ?, 
      numero_adulto = ?, 
      numero_crianca = ?, 
      observacoes = ?, 
      pago = ?, 
      quantidade_diarias = ?, 
      valor_total = ? 
      WHERE id_reserva = ?`;
  const params = [
    reserva.status_reserva,           
    reserva.fk_hospede,            
    reserva.fk_acomodacao,      
    reserva.data_checkin,       
    reserva.data_checkout,          
    reserva.valor_diaria,        
    reserva.numero_adulto,         
    reserva.numero_crianca,        
    observacoes, 
    reserva.pago,
    reserva.quantidade_diarias, 
    reserva.valor_total,        
    id
  ];

  try {
    const [retorno] = await conexao.query(sql, params);
    console.log("Atualizando Reserva");

    if (retorno.affectedRows < 1) {
      return [404, { mensagem: "Reserva não encontrada" }];
    }

    return [200, { mensagem: "Reserva atualizada" }];
  } catch (error) {
    console.error(error);
    return [500, error];
  }
}


export async function updateStatusReserva(id, novoStatus) {
  console.log("ReservaModel: updateStatusReserva");

  const conexao = mysql.createPool(db); // Configuração da conexão com o banco de dados

  // SQL para atualizar o campo `status_reserva` da reserva com o ID especificado
  const sqlAtualizarReserva = `UPDATE reservas SET status_reserva = ? WHERE id_reserva = ?`;
  const paramsReserva = [novoStatus, id];

  try {
    // Inicia uma transação
    await conexao.query("START TRANSACTION");

    // Atualiza o status da reserva
    const [retornoReserva] = await conexao.query(sqlAtualizarReserva, paramsReserva);
    console.log("Atualizando status da reserva no banco de dados");

    if (retornoReserva.affectedRows < 1) {
      console.log(`Nenhuma reserva encontrada com o ID: ${id}`);
      await conexao.query("ROLLBACK");
      return [404, { mensagem: "Reserva não encontrada ou nenhum registro atualizado." }];
    }

    // Se o novo status for "finalizada", atualiza o status da acomodação para "em limpeza"
    if (novoStatus === "finalizada") {
      // Obter o ID da acomodação associada à reserva
      const sqlObterAcomodacao = `SELECT fk_acomodacao FROM reservas WHERE id_reserva = ?`;
      const [resultadoAcomodacao] = await conexao.query(sqlObterAcomodacao, [id]);

      if (resultadoAcomodacao.length === 0) {
        console.log(`Nenhuma acomodação encontrada para a reserva ID: ${id}`);
        await conexao.query("ROLLBACK");
        return [404, { mensagem: "Acomodação não encontrada para esta reserva." }];
      }

      const idAcomodacao = resultadoAcomodacao[0].fk_acomodacao;
      console.log(`ID da acomodação associada à reserva: ${idAcomodacao}`);

      // SQL para atualizar o status da acomodação
      const sqlAtualizarAcomodacao = `
        UPDATE acomodacao 
        SET status = 'em limpeza' 
        WHERE id = ?`;
      const paramsAcomodacao = [idAcomodacao];

      const [retornoAcomodacao] = await conexao.query(sqlAtualizarAcomodacao, paramsAcomodacao);

      if (retornoAcomodacao.affectedRows < 1) {
        console.log(`Falha ao atualizar o status da acomodação ID: ${idAcomodacao}`);
        await conexao.query("ROLLBACK");
        return [404, { mensagem: "Falha ao atualizar o status da acomodação." }];
      }

      console.log("Status da acomodação atualizado para 'em limpeza'");
    }

    // Confirma a transação
    await conexao.query("COMMIT");

    // Retorna sucesso com mensagem
    return [200, { mensagem: `Status da reserva atualizado para '${novoStatus}' com sucesso.` }];
  } catch (error) {
    console.error('Erro ao atualizar status da reserva ou acomodação:', error.message);
    await conexao.query("ROLLBACK");
    return [500, { mensagem: 'Erro ao atualizar status da reserva ou acomodação.', detalhes: error.message }];
  } finally {
    // Fecha a conexão do pool
    await conexao.end();
  }
}

export const verificarDisponibilidade = async (dataEntrada, dataSaida, acomodacaoId, reservaId) => {
  console.log('ReservaModel: verificarDisponibilidade');
  
  const conexao = mysql.createPool(db);
  
  const sql = `
    SELECT COUNT(*) as count
    FROM reservas
    WHERE fk_acomodacao = ? 
    AND (id_reserva != ? OR ? IS NULL) -- Ignorar a reserva atual, caso reservaId seja fornecido
    AND (
      (data_checkin BETWEEN ? AND ?) 
      OR (data_checkout BETWEEN ? AND ?)
      OR (? BETWEEN data_checkin AND data_checkout)
      OR (? BETWEEN data_checkin AND data_checkout)
    )
  `;
  
  const params = [
    acomodacaoId,
    reservaId,
    reservaId,
    dataEntrada, dataSaida,
    dataEntrada, dataSaida,
    dataEntrada, dataSaida
  ];

  try {
    const [retorno] = await conexao.query(sql, params);
    console.log('Resultado da consulta:', retorno);

    // Retorna um valor booleano diretamente
    const disponivel = retorno[0].count === 0;
    console.log('Disponibilidade calculada:', disponivel);
    return disponivel;
  } catch (error) {
    console.error('Erro ao verificar a disponibilidade:', error);
    throw error; // Deixe o erro ser tratado na camada superior
  }
};




export async function buscarStatusReservaPorData(acomodacaoId, dataAtual) {
  const conexao = mysql.createPool(db);

  const sql = `
    SELECT 
      status_reserva, 
      nome_hospede, 
      data_checkin, 
      data_checkout,
      id_reserva,
      pago 
    FROM view_informacoes_reserva
    WHERE fk_acomodacao = ?
      AND ? BETWEEN data_checkin AND data_checkout
      AND status_reserva IN ('Reservado', 'Hospedado', 'Bloqueado', 'em limpeza')
  `;

  const params = [acomodacaoId, dataAtual];

  try {
    // Validação dos parâmetros
    if (!acomodacaoId || !dataAtual) {
      throw new Error('Parâmetros inválidos: "acomodacaoId" ou "dataAtual" não fornecidos.');
    }

    // Executa a consulta
    const [retorno] = await conexao.query(sql, params);

    // Verifica se a reserva foi encontrada
    if (retorno.length > 0) {
      return [200, retorno[0]]; // Retorna o status, nome do hóspede e datas
    } else {
      return [404, { mensagem: 'Nenhuma reserva encontrada para a data especificada.' }];
    }
  } catch (error) {
    console.error('Erro ao buscar status da reserva:', error);

    // Retorno de erro padronizado
    return [500, { mensagem: 'Erro interno ao buscar status da reserva.', detalhes: error.message }];
  } finally {
    // Fecha a conexão
    if (conexao && conexao.end) {
      await conexao.end();
    }
  }
}

// Função para buscar reservas com status bloqueado
export async function getReservasBloqueadas() {
  console.log('ReservaModel: getReservasBloqueadas');
  
  const conexao = mysql.createPool(db); // Cria uma pool de conexões com o banco

  // SQL para buscar somente as reservas com status "bloqueado"
  const sql = `
        SELECT 
            id_reserva,
            nome_hospede,
            data_checkin,
            data_checkout,
            nome_acomodacao,
            status_reserva
        FROM view_informacoes_reserva
        WHERE status_reserva = 'bloqueado';
    `;

  try {
    // Executa a consulta no banco
    const [retorno] = await conexao.query(sql);
    console.log('Reservas bloqueadas encontradas:', retorno.length);

    // Verifica se há resultados
    if (retorno.length < 1) {
      return [404, { mensagem: 'Nenhuma reserva bloqueada encontrada.' }];
    }

    // Retorna as reservas encontradas
    return [200, retorno];
  } catch (error) {
    console.error('Erro ao buscar reservas bloqueadas:', error);

    // Retorna erro padronizado
    return [500, { mensagem: 'Erro interno ao buscar reservas bloqueadas.', detalhes: error.message }];
  } finally {
    // Fecha a pool de conexões
    await conexao.end();
  }
}












