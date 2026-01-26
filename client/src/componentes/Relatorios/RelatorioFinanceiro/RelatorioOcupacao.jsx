import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const RelatorioOcupacao = () => {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [dadosRelatorio, setDadosRelatorio] = useState([]);
    const [tipoGrafico, setTipoGrafico] = useState('barras'); // Estado para definir o tipo de gráfico
    const [acomodacaoSelecionada, setAcomodacaoSelecionada] = useState(''); // Estado para acomodação selecionada
    const navigate = useNavigate(); // Para navegação
    const buscarRelatorio = async () => {
        try {
            const response = await axios.get('http://localhost:5000/relatorios/ocupacao', {
                params: { dataInicio, dataFim }
            });
            setDadosRelatorio(response.data);
            setAcomodacaoSelecionada(''); // Resetar acomodação selecionada após nova busca
        } catch (error) {
        }
    };

    const gerarGraficoBarras = () => {
        const labels = dadosRelatorio.map(d => d.nome_acomodacao);
        const data = dadosRelatorio.map(d => parseFloat(d.taxa_ocupacao));

        return {
            labels,
            datasets: [
                {
                    label: 'Taxa de Ocupação (%)',
                    data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    const gerarGraficoPizza = () => {
        if (!acomodacaoSelecionada) {
            // Mostrar todas as acomodações
            const labels = dadosRelatorio.map(d => d.nome_acomodacao);
            const data = dadosRelatorio.map(d => parseFloat(d.taxa_ocupacao));
            

            return {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };
        } else {
            // Mostrar apenas a acomodação selecionada
            const acomodacao = dadosRelatorio.find(d => d.nome_acomodacao === acomodacaoSelecionada);
            if (!acomodacao) return;

            const ocupacao = parseFloat(acomodacao.taxa_ocupacao);
            const restante = 100 - ocupacao;

            return {
                labels: ['Ocupado (%)', 'Disponível (%)'],
                datasets: [
                    {
                        data: [ocupacao, restante],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)', // Ocupado
                            'rgba(54, 162, 235, 0.6)'  // Disponível
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1,
                    },
                ],
            };
        }
    };

    return (
        <div style={{
            width: '90%',
            height: '90vh',
            margin: '0 auto',
            padding: '20px',
            overflow: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            position: 'relative'
        }}>
            {/* Botão Voltar */}
            <button
                className="btn btn-danger"
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px'
                }}
                onClick={() => navigate('/atalhos_relatorios')}
            >
                Voltar
            </button>
            <h2>Relatório de Ocupação por Período</h2>
            <div className="d-flex align-items-end gap-3 mb-4">
                <div>
                    <label className="form-label">Data Início:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dataInicio}
                        onChange={e => setDataInicio(e.target.value)}
                    />
                </div>
                <div>
                    <label className="form-label">Data Fim:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dataFim}
                        onChange={e => setDataFim(e.target.value)}
                    />
                </div>
                <button
                    className="btn btn-primary"
                    onClick={buscarRelatorio}
                    style={{ height: '38px', marginTop: '30px' }}
                >
                    Gerar Relatório
                </button>
            </div>

            {dadosRelatorio.length > 0 && (
                <div>
                    <h3>Tabela de Ocupação por Acomodação</h3>
                    <table className="table table-striped table-bordered mt-3">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Acomodação</th>
                                <th>Total de Dias</th>
                                <th>Total de Reservas</th>
                                <th>Total de Diárias Ocupadas</th>
                                <th>Total de Diárias Disponíveis</th>
                                <th>Taxa de Ocupação (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dadosRelatorio.map((d, index) => (
                                <tr key={index}>
                                    <td>{d.id_acomodacao}</td>
                                    <td>{d.nome_acomodacao}</td>
                                    <td>{d.total_diarias_disponiveis}</td>
                                    <td>{d.total_reservas}</td>
                                    <td>{d.total_diarias_ocupadas}</td>
                                    <td>{d.total_diarias_disponiveis - d.total_diarias_ocupadas}</td>
                                    <td>{d.taxa_ocupacao}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-5 d-flex align-items-center gap-2">
                        <label className="form-label mb-0">Escolha o tipo de gráfico:</label>
                        <select
                            className="form-select form-select-sm w-auto"
                            value={tipoGrafico}
                            onChange={e => setTipoGrafico(e.target.value)}
                        >
                            <option value="barras">Gráfico de Barras</option>
                            <option value="pizza">Gráfico de Pizza</option>
                        </select>

                        {tipoGrafico === 'pizza' && (
                            <>
                                <label className="form-label mb-0">Acomodação:</label>
                                <select
                                    className="form-select form-select-sm w-auto"
                                    value={acomodacaoSelecionada}
                                    onChange={e => setAcomodacaoSelecionada(e.target.value)}
                                >
                                    <option value="">Todas</option>
                                    {dadosRelatorio.map((d, index) => (
                                        <option key={index} value={d.nome_acomodacao}>
                                            {d.nome_acomodacao}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>

                    {tipoGrafico === 'barras' ? (
                        <div>
                            <h3 className="mt-5">Gráfico de Ocupação (Barras)</h3>
                            <div style={{ width: '60%', margin: '0 auto' }}>
                                <Bar
                                    data={gerarGraficoBarras()}
                                    options={{
                                        maintainAspectRatio: false,
                                        responsive: true
                                    }}
                                    style={{ height: '300px' }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="mt-5">Gráfico de Ocupação (Pizza)</h3>
                            <div style={{ width: '60%', margin: '0 auto' }}>
                                <Pie
                                    data={gerarGraficoPizza()}
                                    options={{
                                        maintainAspectRatio: false,
                                        responsive: true
                                    }}
                                    style={{ height: '300px' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RelatorioOcupacao;
