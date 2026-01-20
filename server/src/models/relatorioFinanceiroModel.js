//importando pacote mysql
import mysql from 'mysql2/promise';

//importando configurações do banco
import db from '../conexao.js';

// Lendo Relatório Financeiro
export async function readRelatorioFinanceiro(filtros) {
    console.log("RelatorioFinanceiroModel: readRelatorioFinanceiro");
    const conexao = mysql.createPool(db);

    const { dataInicio, dataFim } = filtros;

    const sql = `
        SELECT 
            r.fk_acomodacao,
            a.nome AS nome_acomodacao,
            COUNT(r.id_reserva) AS total_reservas,
            SUM(r.valor_total) AS receita_total,
            AVG(r.valor_diaria) AS media_diaria,
            MIN(r.data_checkin) AS primeira_reserva,
            MAX(r.data_checkout) AS ultima_reserva,
            SUM(DATEDIFF(r.data_checkout, r.data_checkin)) AS total_diarias_reservadas
        FROM reservas r
        INNER JOIN acomodacao a ON r.fk_acomodacao = a.id
        WHERE r.data_checkin >= ? AND r.data_checkout <= ? AND r.status_reserva = 'finalizada'
        GROUP BY r.fk_acomodacao, a.nome
        ORDER BY receita_total DESC;
    `;

    try {
        const [resultados] = await conexao.query(sql, [dataInicio, dataFim]);
        console.log("Relatório Financeiro Gerado:", resultados);
        return [200, resultados];
    } catch (error) {
        console.error("Erro ao gerar relatório financeiro:", error);
        return [500, { mensagem: 'Erro ao gerar o relatório financeiro', detalhes: error.message }];
    }
}


// Lendo Previsão de Receita
export async function readPrevisaoReceita(filtros) {
    console.log("RelatorioFinanceiroModel: readPrevisaoReceita");
    const conexao = mysql.createPool(db);

    const { dataInicio, dataFim } = filtros;

    const sql = `
        SELECT 
            r.fk_acomodacao,
            a.nome AS nome_acomodacao,
            COUNT(r.id_reserva) AS total_reservas,
            SUM(r.valor_total) AS receita_total,
            AVG(r.valor_diaria) AS media_diaria,
            MIN(r.data_checkin) AS primeira_reserva,
            MAX(r.data_checkout) AS ultima_reserva,
            SUM(DATEDIFF(r.data_checkout, r.data_checkin)) AS total_diarias_reservadas
        FROM reservas r
        INNER JOIN acomodacao a ON r.fk_acomodacao = a.id
        WHERE r.data_checkin >= ? AND r.data_checkout <= ? AND r.status_reserva IN ('reservado', 'hospedado')
        GROUP BY r.fk_acomodacao, a.nome
        ORDER BY receita_total DESC;
    `;

    try {
        const [resultados] = await conexao.query(sql, [dataInicio, dataFim]);
        console.log("Previsão de Receita Gerada:", resultados);
        return [200, resultados];
    } catch (error) {
        console.error("Erro ao gerar previsão de receita:", error);
        return [500, { mensagem: 'Erro ao gerar a previsão de receita', detalhes: error.message }];
    }
}

// Lendo Relatório de Ocupação
export async function readRelatorioOcupacao(filtros) {
    console.log("RelatorioFinanceiroModel: readRelatorioOcupacao");
    const conexao = mysql.createPool(db);

    const { dataInicio, dataFim } = filtros;

    const sql = `
        SELECT 
            a.id AS id_acomodacao,
            a.nome AS nome_acomodacao,
            COUNT(r.id_reserva) AS total_reservas,
            SUM(DATEDIFF(LEAST(r.data_checkout, ?), GREATEST(r.data_checkin, ?)) + 1) AS total_diarias_ocupadas,
            DATEDIFF(?, ?) * COUNT(DISTINCT a.id) AS total_diarias_disponiveis
        FROM acomodacao a
        LEFT JOIN reservas r ON a.id = r.fk_acomodacao AND r.status_reserva IN ('hospedado', 'finalizada', 'reservado') 
            AND r.data_checkin <= ? AND r.data_checkout >= ?
        GROUP BY a.id, a.nome;
    `;

    try {
        const [resultados] = await conexao.query(sql, [
            dataFim, dataInicio, dataFim, dataInicio, dataFim, dataInicio
        ]);

        const relatorio = resultados.map(row => ({
            id_acomodacao: row.id_acomodacao,
            nome_acomodacao: row.nome_acomodacao,
            total_reservas: row.total_reservas || 0,
            total_diarias_ocupadas: row.total_diarias_ocupadas || 0,
            total_diarias_disponiveis: row.total_diarias_disponiveis || 0,
            taxa_ocupacao: row.total_diarias_disponiveis 
                ? ((row.total_diarias_ocupadas / row.total_diarias_disponiveis) * 100).toFixed(2) 
                : 0
        }));

        console.log("Relatório de Ocupação Gerado:", relatorio);
        return [200, relatorio];
    } catch (error) {
        console.error("Erro ao gerar relatório de ocupação:", error);
        return [500, { mensagem: 'Erro ao gerar o relatório de ocupação', detalhes: error.message }];
    }
}
