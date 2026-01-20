import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Filters from './Filters';  // Componente de filtros
import ReportCard from './ReportCard';  // Componente para exibir as métricas
import Header from './Header';  // Componente de cabeçalho
import './css.css';  // Arquivo CSS para estilos

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registre os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Estado para armazenar as estatísticas e os dados do gráfico
  const [ocupacao, setOcupacao] = useState('0%');
  const [mediaPorDia, setMediaPorDia] = useState('0 Reservas/Dia');
  const [totalReservas, setTotalReservas] = useState('0 Reservas');
  const [chartData, setChartData] = useState([]);  // Dados para o gráfico
  const [selectedMonth, setSelectedMonth] = useState('all'); // Mês selecionado
  const [loading, setLoading] = useState(false);  // Estado de carregamento

  // Função para buscar os dados do backend
  const fetchData = async (year, month) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/reservas-dashboard', {
        params: { year, month }
      });

      const { ocupacao, mediaPorDia, totalReservas, reservasMensais } = response.data;

      // Atualiza os estados com os dados recebidos
      setOcupacao(ocupacao);
      setMediaPorDia(mediaPorDia);
      setTotalReservas(totalReservas);
      setChartData(reservasMensais);

      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setLoading(false);
    }
  };

  // Função para atualizar as estatísticas e dados do gráfico com base no filtro
  const handleFilterChange = (year, month) => {
    setSelectedMonth(month);  // Atualiza o mês selecionado
    fetchData(year, month);  // Chama a função para buscar os dados filtrados
  };

  // Filtra os dados do gráfico com base no mês selecionado
  const filteredData = selectedMonth === 'all' ? chartData : [chartData[selectedMonth]];

  // Rótulos do gráfico (meses)
  const monthLabels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'];

  // Filtra os rótulos com base no mês selecionado
  const filteredLabels = selectedMonth === 'all' ? monthLabels : [monthLabels[selectedMonth]];

  // Dados do gráfico
  const data = {
    labels: filteredLabels,  // Usando os rótulos filtrados
    datasets: [
      {
        label: 'Reservas',
        data: filteredData,  // Usando os dados filtrados
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opções do gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Reservas Mensais',
      },
    },
  };

  return (
    <div className="container">
      <Header />  {/* Agora o Header é renderizado */}
      <Filters onFilterChange={handleFilterChange} />  {/* Passa a função de atualização para o filtro */}

      <div className="dashboard">
        <ReportCard title="Taxa de Ocupação" value={ocupacao} />
        <ReportCard title="Média por Dia" value={mediaPorDia} />
        <ReportCard title="Total de Reservas" value={totalReservas} />
      </div>

      <div className="chart-container">
        <h3>Gráfico de Reservas Mensais</h3>
        {loading ? <p>Carregando...</p> : <Bar data={data} options={options} />}
      </div>
    </div>
  );
};

export default Dashboard;
