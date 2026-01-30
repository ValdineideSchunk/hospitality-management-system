import express from 'express';
import cors from 'cors';

import { cadastroAcomodacao, mostrandoAcomodacoes, atualizandoAcomodacao, excluindoAcomodacao, 
mostrandoAcomodacaoPorId, mostrandoAcomodacoesDisponiveis, bloquearAcomodacao, 
verificarConflitoReservas} from './controllers/acomodacoesController.js'; 
import { cadastroHospede, atualizandoHospede, excluindoHospede, mostrandoHospedes, mostrandoUmHospede, verificandoCPF } from './controllers/HospedeController.js'; 
import { cadastroFuncionario, mostrandoFuncionarios, atualizandoFuncionario, mostrandoUmFuncionario } from './controllers/FuncionarioController.js'; 
import { cadastroReserva, mostrandoReservas, mostrandoUmaReserva, atualizandoReserva,
   alterarStatusReserva, verificarDisponibilidadeAcomodacao, buscarStatusReserva, 
   buscarReservasBloqueadas} from './controllers/reservaController.js';
import { atualizarUsuario, criarUsuario, logarUsuario, mostrarUmUsuario, mostrarUsuario } from './controllers/UsuarioController.js';
import { buscarRelatorioFinanceiro, getPrevisaoReceita, getRelatorioOcupacao } from './controllers/relatorioFinanceiroController.js';
import { verificarToken, verificarAdmin } from './middlewares/authMiddleware.js';



 
const app = express();
const porta = 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('API Funcionando');
});

//Rota pública para Logar (SEM proteção)
app.post('/logar/', logarUsuario);

// ============= ROTAS PROTEGIDAS (requerem autenticação) =============

// Rotas de CRUD de hóspedes
app.post('/hospede', verificarToken, cadastroHospede);
app.get('/hospede', verificarToken, mostrandoHospedes);
app.get('/hospedes/:id', verificarToken, mostrandoUmHospede)
app.put('/hospedes/:id', verificarToken, atualizandoHospede);
app.delete('/hospede/:id', verificarToken, excluindoHospede);
app.get('/verificar-cpf/:cpf', verificarToken, verificandoCPF);

// Rotas de CRUD de funcionário
app.post('/funcionario', verificarToken, cadastroFuncionario);
app.get('/funcionario', verificarToken, mostrandoFuncionarios);
app.get('/funcionario/:id', verificarToken, mostrandoUmFuncionario);
app.put('/funcionario/:id', verificarToken, atualizandoFuncionario);

// Rotas de CRUD de acomodações
app.post('/acomodacoes', verificarToken, cadastroAcomodacao);
app.get('/acomodacoes', verificarToken, mostrandoAcomodacoes);
app.get('/acomodacoes/:id', verificarToken, mostrandoAcomodacaoPorId);
app.put('/acomodacoes/:id', verificarToken, atualizandoAcomodacao);
app.delete('/acomodacoes/:id', verificarToken, excluindoAcomodacao);
app.get('/acomodacoes/disponiveis/:dataInicio/:dataFim', verificarToken, mostrandoAcomodacoesDisponiveis);
app.get('/acomodacoes/disponibilidade/:dataEntrada/:dataSaida/:acomodacaoAtual/:idReserva', verificarToken, verificarDisponibilidadeAcomodacao);

// Rota para bloquear acomodação
app.post("/bloquear", verificarToken, bloquearAcomodacao);
app.post("/acomodacoes/verificar-conflito", verificarToken, verificarConflitoReservas);
app.get('/reservas/bloqueadas', verificarToken, buscarReservasBloqueadas);

// Rotas de CRUD de reserva
app.post('/reservas', verificarToken, cadastroReserva);
app.get('/reservas', verificarToken, mostrandoReservas);
app.get('/reservas/:id', verificarToken, mostrandoUmaReserva);
app.put('/reservas/:id', verificarToken, atualizandoReserva);
app.put('/reservas/:id/status', verificarToken, alterarStatusReserva);

//CRUD Usuario
app.post('/usuario/', verificarToken, criarUsuario);
app.get('/usuario/', verificarToken, mostrarUsuario);
app.get('/usuario/:id_usuario', verificarToken, mostrarUmUsuario);
app.put('/usuario/:id_usuario', verificarToken, atualizarUsuario);

// Rota para Home
app.get('/status/:acomodacaoId', verificarToken, buscarStatusReserva);

// Rotas de relatórios
app.get('/relatorios/financeiro', verificarToken, buscarRelatorioFinanceiro);
app.get('/relatorios/previsao-receita', verificarToken, getPrevisaoReceita);
app.get('/relatorios/ocupacao', verificarToken, getRelatorioOcupacao);



app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
