import { readRelatorioFinanceiro, readPrevisaoReceita, readRelatorioOcupacao } from '../models/relatorioFinanceiroModel.js';

export async function buscarRelatorioFinanceiro(req, res) {
    console.log('RelatorioFinanceiroController: buscarRelatorioFinanceiro');

    // Coleta os filtros da query string
    const filtros = {
        dataInicio: req.query.dataInicio,
        dataFim: req.query.dataFim,
    };

    console.log('Parâmetros de busca:', filtros);

    if (!filtros.dataInicio || !filtros.dataFim) {
        return res.status(400).json({ mensagem: 'Os parâmetros dataInicio e dataFim são obrigatórios.' });
    }

    try {
        const [status, relatorio] = await readRelatorioFinanceiro(filtros);
        res.status(status).json(relatorio);
    } catch (error) {
        console.error('Erro ao buscar relatório financeiro:', error);
        res.status(500).json({ mensagem: 'Erro ao buscar relatório financeiro', detalhes: error.message });
    }
}

// Previsão de Receita
export async function getPrevisaoReceita(req, res) {
    console.log("RelatorioFinanceiroController: getPrevisaoReceita");

    const filtros = {
        dataInicio: req.query.dataInicio,
        dataFim: req.query.dataFim,
    };

    try {
        const [status, resultados] = await readPrevisaoReceita(filtros);
        res.status(status).json(resultados);
    } catch (error) {
        console.error("Erro ao obter previsão de receita:", error);
        res.status(500).json({ mensagem: "Erro ao obter previsão de receita", detalhes: error.message });
    }
}

// Relatório de Ocupação
export async function getRelatorioOcupacao(req, res) {
    console.log("RelatorioFinanceiroController: getRelatorioOcupacao");

    const filtros = {
        dataInicio: req.query.dataInicio,
        dataFim: req.query.dataFim,
    };

    try {
        const [status, resultados] = await readRelatorioOcupacao(filtros);
        res.status(status).json(resultados);
    } catch (error) {
        console.error("Erro ao obter relatório de ocupação:", error);
        res.status(500).json({ mensagem: "Erro ao obter relatório de ocupação", detalhes: error.message });
    }
}
