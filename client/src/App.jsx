import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './componentes/ProtectedRoute';

// Importação dos componentes
import Login from './componentes/pages/Login';
import Home from './componentes/home/Home';

// Importação dos componentes para funcionários
import CadastroFuncionario from './componentes/pages/CadastroFuncionario';
import TabelaFuncionarios from './componentes/Funcionarios/TabelaFuncionarios/TabelaFuncionarios';
import EditarFuncionario from './componentes/pages/EditarFuncionario';
import CadastroUsuario from './componentes/pages/CadastroUsuario';

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
          {/* Rota padrão - redireciona para login ou home */}
          <Route path='/' element={<Navigate to='/login' replace />} />

          {/* Rota pública para login */}
          <Route path='/login' element={<Login />} />

          {/* Rotas protegidas - requerem autenticação */}
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* Rotas para funcionários */}
          <Route path='/cadastro_funcionario' element={<ProtectedRoute><CadastroFuncionario /></ProtectedRoute>} />
          <Route path='/tabela_funcionarios' element={<ProtectedRoute><TabelaFuncionarios /></ProtectedRoute>} />
          <Route path='/editar_funcionario/:id' element={<ProtectedRoute><EditarFuncionario /></ProtectedRoute>} />
          <Route path='/cadastro_usuario' element={<ProtectedRoute><CadastroUsuario /></ProtectedRoute>} />

          {/* Rotas para acomodações */}
          <Route path='/cadastro_acomodacao' element={<ProtectedRoute><CadastroAcomodacao /></ProtectedRoute>} />
          <Route path='/listagem_acomodacoes' element={<ProtectedRoute><ListaAcomodacoes /></ProtectedRoute>} />
          <Route path='/editar_acomodacao/:id' element={<ProtectedRoute><CadastroAcomodacao /></ProtectedRoute>} />
          <Route path='/bloquear_acomodacao' element={<ProtectedRoute><BloquearAcomodacao /></ProtectedRoute>} />
          <Route path="/acomodacoes_bloqueadas" element={<ProtectedRoute><ListaAcomodacoesBloqueadas /></ProtectedRoute>} />

          {/* Rotas para hóspedes */}
          <Route path='/cadastro_hospede' element={<ProtectedRoute><CadastroHospede /></ProtectedRoute>} />
          <Route path='/tabela_hospedes' element={<ProtectedRoute><TabelaHospedes /></ProtectedRoute>} />
          <Route path='/editar_hospede/:id' element={<ProtectedRoute><EditarHospede /></ProtectedRoute>} />

          {/* Rotas para reservas */}
          <Route path='/cadastro_reserva' element={<ProtectedRoute><CadastroReserva /></ProtectedRoute>} />
          <Route path='/tabela_reserva' element={<ProtectedRoute><TabelaReservas /></ProtectedRoute>} />
          <Route path='/cadastro_reserva/:id' element={<ProtectedRoute><CadastroReserva /></ProtectedRoute>} />

          {/* Rota para o Mapa de Reservas */}
          <Route path='/mapa_reservas' element={<ProtectedRoute><MapaReservas /></ProtectedRoute>} />

          {/* Rotas para relatórios */}
          <Route path='/atalhos_relatorios' element={<ProtectedRoute><AtalhoRelatorios /></ProtectedRoute>} />
          <Route path='/relatorio_financeiro' element={<ProtectedRoute><RelatorioFinanceiro /></ProtectedRoute>} />
          <Route path='/previsao_receita' element={<ProtectedRoute><PrevisaoReceita /></ProtectedRoute>} />
          <Route path='/relatorio_ocupacao' element={<ProtectedRoute><RelatorioOcupacao /></ProtectedRoute>} />

        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
