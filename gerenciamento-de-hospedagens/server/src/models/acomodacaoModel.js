import mysql from 'mysql2/promise';
import db from '../conexao.js';

// Criação do Pool de Conexões
const conexao = mysql.createPool(db);

// Cadastrando Acomodação
export async function createAcomodacao(acomodacao) {
    const sql = `INSERT INTO acomodacao 
        (Nome, Capacidade, Tipo, Observacoes, Status, Wifi, Tv, arCondicionado, Frigobar, banheirosAdaptados, sinalizacaoBraille, entradaAcessivel, estacionamentoAcessivel) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        acomodacao.nome,
        acomodacao.capacidade,
        acomodacao.tipo,
        acomodacao.observacoes,
        acomodacao.status || 'Disponível',
        acomodacao.wifi || false,
        acomodacao.tv || false,
        acomodacao.arCondicionado || false,
        acomodacao.frigobar || false,
        acomodacao.banheirosAdaptados || false,
        acomodacao.sinalizacaoBraille || false,
        acomodacao.entradaAcessivel || false,
        acomodacao.estacionamentoAcessivel || false
    ];

    try {
        const [retorno] = await conexao.query(sql, params);
        return [201, retorno];  // Retorna código 201 para sucesso
    } catch (error) {
        console.error('Erro ao cadastrar acomodação:', error);
        throw error;  // Lança erro para ser tratado em outro lugar
    }
}

// Mostrando todas as Acomodações
export async function mostrandoAcomodacoes() {
    const sql = `SELECT * FROM acomodacao`;

    try {
        const [acomodacoes] = await conexao.query(sql);
        return acomodacoes;  // Retorna todas as acomodações
    } catch (error) {
        console.error('Erro ao listar acomodações:', error);
        throw error;  // Lança erro para ser tratado em outro lugar
    }
}

// Mostrando Acomodação por ID
export async function mostrandoAcomodacaoPorId(id) {
    const sql = `SELECT * FROM acomodacao WHERE id = ?`;

    try {
        const [acomodacao] = await conexao.query(sql, [id]);
        return acomodacao[0]; // Retorna a acomodação ou undefined se não encontrada
    } catch (error) {
        console.error('Erro ao buscar acomodação por ID:', error);
        throw error;  // Lança erro para ser tratado em outro lugar
    }
}

// Atualizando Acomodação
export async function atualizandoAcomodacao(id, acomodacao) {
    // Construir dinamicamente o SQL e os parâmetros
    const campos = [];
    const valores = [];

    if (acomodacao.nome !== undefined) {
        campos.push('Nome = ?');
        valores.push(acomodacao.nome);
    }
    if (acomodacao.capacidade !== undefined) {
        campos.push('Capacidade = ?');
        valores.push(acomodacao.capacidade);
    }
    if (acomodacao.tipo !== undefined) {
        campos.push('Tipo = ?');
        valores.push(acomodacao.tipo);
    }
    if (acomodacao.observacoes !== undefined) {
        campos.push('Observacoes = ?');
        valores.push(acomodacao.observacoes);
    }
    if (acomodacao.status !== undefined) {
        campos.push('Status = ?');
        valores.push(acomodacao.status);
    }
    if (acomodacao.wifi !== undefined) {
        campos.push('Wifi = ?');
        valores.push(acomodacao.wifi);
    }
    if (acomodacao.tv !== undefined) {
        campos.push('Tv = ?');
        valores.push(acomodacao.tv);
    }
    if (acomodacao.arCondicionado !== undefined) {
        campos.push('arCondicionado = ?');
        valores.push(acomodacao.arCondicionado);
    }
    if (acomodacao.frigobar !== undefined) {
        campos.push('Frigobar = ?');
        valores.push(acomodacao.frigobar);
    }
    if (acomodacao.banheirosAdaptados !== undefined) {
        campos.push('banheirosAdaptados = ?');
        valores.push(acomodacao.banheirosAdaptados);
    }
    if (acomodacao.sinalizacaoBraille !== undefined) {
        campos.push('sinalizacaoBraille = ?');
        valores.push(acomodacao.sinalizacaoBraille);
    }
    if (acomodacao.entradaAcessivel !== undefined) {
        campos.push('entradaAcessivel = ?');
        valores.push(acomodacao.entradaAcessivel);
    }
    if (acomodacao.estacionamentoAcessivel !== undefined) {
        campos.push('estacionamentoAcessivel = ?');
        valores.push(acomodacao.estacionamentoAcessivel);
    }

    // Garantir que há algo para atualizar
    if (campos.length === 0) {
        throw new Error('Nenhum campo fornecido para atualização.');
    }

    // Adicionar o ID no final dos parâmetros
    valores.push(id);

    // Construir o SQL dinamicamente
    const sql = `UPDATE acomodacao SET ${campos.join(', ')} WHERE id = ?`;

    try {
        const [retorno] = await conexao.query(sql, valores);
        return [200, retorno]; // Retorna código 200 para sucesso
    } catch (error) {
        console.error('Erro ao atualizar acomodação:', error);
        throw error; // Lança erro para ser tratado em outro lugar
    }
}


// Excluindo Acomodação
export async function excluindoAcomodacao(id) {
    const sql = `DELETE FROM acomodacao WHERE id = ?`;

    try {
        const [retorno] = await conexao.query(sql, [id]);
        return [200, retorno];  // Retorna código 200 para sucesso
    } catch (error) {
        console.error('Erro ao excluir acomodação:', error);
        throw error;  // Lança erro para ser tratado em outro lugar
    }
}

// Filtrando Acomodações por Status
export async function filtrandoAcomodacoesPorStatus(status) {
    const sql = `SELECT * FROM acomodacao WHERE Status = ?`;

    try {
        const [acomodacoes] = await conexao.query(sql, [status]);
        return acomodacoes;  // Retorna as acomodações filtradas pelo status
    } catch (error) {
        console.error('Erro ao filtrar acomodações por status:', error);
        throw error;  // Lança erro para ser tratado em outro lugar
    }
}

export async function getAcomodacoesDisponiveis(dataInicio, dataFim) {
    console.log('ReservaModel: getAcomodacoesDisponiveis');
    const conexao = mysql.createPool(db);
    
    // A consulta
    const sql = `
    SELECT a.*
FROM acomodacao a
WHERE NOT EXISTS (
    SELECT 1
    FROM reservas r
    WHERE r.fk_acomodacao = a.id
    AND (
        -- Verificar se há sobreposição completa das datas
        (? < r.data_checkout AND ? > r.data_checkin) OR
        (? < r.data_checkout AND ? > r.data_checkin)
    )
    AND r.status_reserva IN ('reservado', 'hospedado', 'bloqueado') -- Adicionando a condição para excluir 'reservado' e 'hospedado'
)

    `;

    // Parâmetros para as datas
    const params = [dataInicio, dataFim, dataInicio, dataFim, dataInicio, dataFim];

    try {
      const [acomodacoesDisponiveis] = await conexao.query(sql, params);
      console.log('Mostrando acomodações disponíveis',dataInicio, dataFim, );

      
      if (acomodacoesDisponiveis.length < 1) {
        return [404, { mensagem: 'Nenhuma acomodação disponível encontrada' }];
      }
  
      return [200, acomodacoesDisponiveis];
    } catch (error) {
      console.error('Erro ao buscar acomodações disponíveis:', error);
      return [500, error];
    }
}

/// Bloquear Acomodação
export async function bloquearAcomodacao(funcionarioId, acomodacaoId, dataInicio, dataFim, motivo) {
    const sql = `
        INSERT INTO reservas (fk_hospede, fk_acomodacao, data_checkin, data_checkout, observacoes, status_reserva)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
        funcionarioId,       // ID do funcionário
        acomodacaoId,        // ID da acomodação
        dataInicio,          // Data de início do bloqueio
        dataFim,             // Data de fim do bloqueio
        motivo,              // Motivo do bloqueio
        "bloqueado"          // Status da reserva
    ];

    try {
        const [resultado] = await conexao.query(sql, params);
        return [201, { message: "Bloqueio registrado com sucesso", resultado }];
    } catch (error) {
        console.error("Erro ao bloquear acomodação:", error);
        return [500, { message: "Erro ao bloquear acomodação", error }];
    }
}

export async function verificarReservasConflitantes(acomodacaoId, dataInicio, dataFim) {
    const sql = `
        SELECT *
        FROM reservas
        WHERE fk_acomodacao = ?
          AND status_reserva IN ('reservado', 'hospedado')
          AND (
            (? BETWEEN data_checkin AND data_checkout) OR
            (? BETWEEN data_checkin AND data_checkout) OR
            (data_checkin BETWEEN ? AND ?) OR
            (data_checkout BETWEEN ? AND ?)
          )
    `;

    const params = [
        acomodacaoId,
        dataInicio,
        dataFim,
        dataInicio,
        dataFim,
        dataInicio,
        dataFim
    ];

    try {
        const [resultado] = await conexao.query(sql, params);

        if (resultado.length > 0) {
            // Há reservas conflitantes
            return [200, { conflito: true, reservas: resultado }];
        }

        // Nenhuma reserva conflitante encontrada
        return [200, { conflito: false }];
    } catch (error) {
        console.error("Erro ao verificar reservas conflitantes:", error);
        return [500, { message: "Erro ao verificar reservas conflitantes", error }];
    }
}


