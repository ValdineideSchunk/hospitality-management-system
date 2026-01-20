import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Importação dos componentes
import Login from './componentes/pages/Login';
import Home from './componentes/home/Home';

// Importação dos componentes para funcionários
import CadastroFuncionario from './componentes/pages/CadastroFuncionario';
import TabelaFuncionarios from './componentes/Funcionarios/TabelaFuncionarios/TabelaFuncionarios';
import EditarFuncionario from './componentes/pages/EditarFuncionario';

// Importação dos componentes para acomodações
import CadastroAcomodacao from './componentes/acomodacao/Cadastro';
import MenuLateral from './componentes/layout/MenuLateral/MenuLateral';
import ListaAcomodacoes from './componentes/acomodacao/ListaAcomodacoes';
import ListaAcomodacoesBloqueadas from './componentes/acomodacao/ListaAcomodacoesBloqueadas'




// Importação dos componentes para hóspedes
import CadastroHospede from './componentes/pages/CadastroHospede';
import TabelaHospedes from './componentes/Hospedes/TabelaHospedes/TabelaHospedes';
import EditarHospede from './componentes/pages/EditarHospede';

// Importação dos componentes para reservas
import CadastroReserva from './componentes/pages/CadastroReserva';
import TabelaReservas from './componentes/Reservas/TabelaReservas/TabelaReservas';



// Importação do Mapa de Reservas
import MapaReservas from './componentes/MapaDeReservas/MapaDeReservas/MapaReservas';

import BloquearAcomodacao from './componentes/acomodacao/BloquearAcomodacao';

import RelatorioFinanceiro from './componentes/Relatorios/RelatorioFinanceiro/RelatorioFinanceiro';
import PrevisaoReceita from './componentes/Relatorios/RelatorioFinanceiro/PrevisaoReceita';
import RelatorioOcupacao from './componentes/Relatorios/RelatorioFinanceiro/RelatorioOcupacao';
import AtalhoRelatorios from './componentes/Relatorios/AtalhoRelatorios';

function AppContent() {
  const location = useLocation();

  return (
    <div className="app-container d-flex">
      {/* Mostra o MenuLateral em todas as rotas, exceto na rota de login */}
      {location.pathname !== '/login' && <MenuLateral />}
      <div className="content flex-grow-1">
        <Routes>
          {/* Rota para login */}
          <Route path='/login' element={<Login />} />

          {/* Rota para a página inicial */}
          <Route path='/home' element={<Home />} />  {/* Nova rota para a Home */}

          {/* Rotas para funcionários */}
          <Route path='/cadastro_funcionario' element={<CadastroFuncionario />} />
          <Route path='/tabela_funcionarios' element={<TabelaFuncionarios />} />
          <Route path='/editar_funcionario/:id' element={<EditarFuncionario />} />

          {/* Rotas para acomodações */}
          <Route path='/cadastro_acomodacao' element={<CadastroAcomodacao />} />
          <Route path='/listagem_acomodacoes' element={<ListaAcomodacoes />} />
          <Route path='/editar_acomodacao/:id' element={<CadastroAcomodacao />} />
          {/* Rota para bloquear acomodação */}
          <Route path='/bloquear_acomodacao' element={<BloquearAcomodacao />} />
          // Adicione a rota para a lista de acomodações bloqueadas
          <Route path="/acomodacoes_bloqueadas" element={<ListaAcomodacoesBloqueadas />} />

          {/* Rotas para hóspedes */}
          <Route path='/cadastro_hospede' element={<CadastroHospede />} />
          <Route path='/tabela_hospedes' element={<TabelaHospedes />} />
          <Route path='/editar_hospede/:id' element={<EditarHospede />} />

          {/* Rotas para reservas */}
          <Route path='/cadastro_reserva' element={<CadastroReserva />} />
          <Route path='/tabela_reserva' element={<TabelaReservas />} />
          <Route path='/cadastro_reserva/:id' element={<CadastroReserva />} />

          {/* Rota para o Mapa de Reservas */}
          <Route path='/mapa_reservas' element={<MapaReservas />} />

          
          <Route path='/atalhos_relatorios' element={<AtalhoRelatorios/>} />
          <Route path='/relatorio_financeiro' element={<RelatorioFinanceiro />} />
          <Route path='/previsao_receita' element={<PrevisaoReceita />} />
          <Route path='/relatorio_ocupacao' element={<RelatorioOcupacao />} />

        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
