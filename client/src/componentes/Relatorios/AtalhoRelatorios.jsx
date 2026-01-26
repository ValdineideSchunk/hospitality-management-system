import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const AtalhoRelatorios = () => {
    const [previsaoOcupacao, setPrevisaoOcupacao] = useState({
        labels: [],
        datasets: [],
    });
    const [receitaConfirmada, setReceitaConfirmada] = useState({
        labels: [],
        datasets: [],
    });
    const [previsaoReceita, setPrevisaoReceita] = useState({
        labels: [],
        datasets: [],
    });
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [dataInicioPrev, setDataInicioPrev] = useState('');
    const [dataFimPrev, setDataFimPrev] = useState('');

    useEffect(() => {
        const hoje = new Date();
        const dataFinal = hoje.toISOString().split('T')[0];
        const dataInicial = new Date(hoje.setDate(hoje.getDate() - 30)).toISOString().split('T')[0];

        setDataInicio(dataInicial);
        setDataFim(dataFinal);

        const hojePrev = new Date();
        const dataInicialPrev = hojePrev.toISOString().split('T')[0];
        const dataFinalPrev = new Date(hojePrev.setDate(hojePrev.getDate() + 30)).toISOString().split('T')[0];

        setDataInicioPrev(dataInicialPrev);
        setDataFimPrev(dataFinalPrev);
    }, []);

    useEffect(() => {
        const fetchPrevisaoOcupacao = async () => {
            if (!dataInicioPrev || !dataFimPrev) return;

            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${apiUrl}/relatorios/ocupacao`, {
                    params: { dataInicio: dataInicioPrev, dataFim: dataFimPrev },
                });

                const data = response.data;
                const labels = data.map(item => item.nome_acomodacao);
                const ocupacoes = data.map(item =>
                    ((parseFloat(item.total_diarias_ocupadas) / parseFloat(item.total_diarias_disponiveis)) * 100).toFixed(2)
                );

                setPrevisaoOcupacao({
                    labels,
                    datasets: [
                        {
                            label: 'Taxa de Ocupação Prevista (%)',
                            data: ocupacoes,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
            }
        };

        const fetchReceitaConfirmada = async () => {
            if (!dataInicio || !dataFim) return;
        
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${apiUrl}/relatorios/financeiro`, {
                    params: { dataInicio, dataFim },
                });
        
                const data = response.data;
        
                const labels = data.map(item => item.nome_acomodacao); // Atualizado
                const receitas = data.map(item => parseFloat(item.receita_total)); // Atualizado
        
                setReceitaConfirmada({
                    labels,
                    datasets: [
                        {
                            label: 'Receita Confirmada (R$)',
                            data: receitas,
                            backgroundColor: 'rgba(255, 99, 132, 0.6)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
            }
        };
        

        const fetchPrevisaoReceita = async () => {
            if (!dataInicioPrev || !dataFimPrev) return;

            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${apiUrl}/relatorios/previsao-receita`, {
                    params: { dataInicio: dataInicioPrev, dataFim: dataFimPrev },
                });

                const data = response.data;
                const labels = data.map(item => item.nome_acomodacao);
                const receitas = data.map(item => parseFloat(item.receita_total));

                setPrevisaoReceita({
                    labels,
                    datasets: [
                        {
                            label: 'Previsão de Receita (R$)',
                            data: receitas,
                            backgroundColor: 'rgba(255, 206, 86, 0.6)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
            }
        };

        fetchPrevisaoOcupacao();
        fetchReceitaConfirmada();
        fetchPrevisaoReceita();
    }, [dataInicio, dataFim, dataInicioPrev, dataFimPrev]);

    return (
        <div
        className="container-fluid mt-5"
        style={{
            minHeight: '95vh', // Garante que ocupa toda a altura da tela
            padding: '0 20px',
            overflow: 'hidden', // Impede rolagem no navegador
            display: 'flex',
            flexDirection: 'column',
        }}
    >
            <h2>Dashboard de Relatórios</h2>
            <p>Selecione o relatório que deseja visualizar:</p>
            <div className="d-flex flex-column gap-3">
                <Link to="/relatorio_financeiro" className="btn btn-primary">
                    Relatório de Receita Confirmada por Período
                </Link>
                <Link to="/previsao_receita" className="btn btn-primary">
                    Relatório de Receita Prevista por Período
                </Link>
                <Link to="/relatorio_ocupacao" className="btn btn-primary">
                    Relatório de Ocupação por Período
                </Link>
            </div>
            <div className="overflow-auto mt-4" style={{ maxHeight: 'calc(83vh - 150px)' }}>
                <div className="mb-4" style={{ height: '400px' }}>
                    <h4>Previsão de Ocupação (Próximos 30 Dias)</h4>
                    <Bar
                        data={previsaoOcupacao}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: value => `${value}%`,
                                    },
                                },
                            },
                        }}
                    />
                </div>
                
                <div className="mb-5" style={{ height: '300px' }}>
                    <h4>Previsão de Receita (Próximos 30 Dias)</h4>
                    <Bar
                        data={previsaoReceita}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: value => `R$ ${value}`,
                                    },
                                },
                            },
                        }}
                    />
                </div>
                <div className="mb-5" style={{ height: '300px' }}>
                    <h4>Receita Confirmada (Últimos 30 Dias)</h4>
                    <Bar
                        data={receitaConfirmada}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: value => `R$ ${value}`,
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AtalhoRelatorios;
