import express from 'express';
import cors from 'cors';

import { cadastroAcomodacao, mostrandoAcomodacoes, atualizandoAcomodacao, excluindoAcomodacao, 
mostrandoAcomodacaoPorId, mostrandoAcomodacoesDisponiveis, bloquearAcomodacao, 
verificarConflitoReservas} from './controllers/acomodacoesController.js'; 
import { cadastroHospede, atualizandoHospede, excluindoHospede, mostrandoHospedes, mostrandoUmHospede } from './controllers/HospedeController.js'; 
import { cadastroFuncionario, mostrandoFuncionarios, atualizandoFuncionario, mostrandoUmFuncionario } from './controllers/FuncionarioController.js'; 
import { cadastroReserva, mostrandoReservas, mostrandoUmaReserva, atualizandoReserva,
   alterarStatusReserva, verificarDisponibilidadeAcomodacao, buscarStatusReserva, 
   buscarReservasBloqueadas} from './controllers/reservaController.js';
import { atualizarUsuario, criarUsuario, logarUsuario, mostrarUmUsuario, mostrarUsuario } from './controllers/UsuarioController.js';
import { buscarRelatorioFinanceiro, getPrevisaoReceita, getRelatorioOcupacao } from './controllers/relatorioFinanceiroController.js'; // Importando o controlador



 
const app = express();
const porta = 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('API Funcionando');
});

// Rotas de CRUD de hóspedes
app.post('/hospede', cadastroHospede);
app.get('/hospede', mostrandoHospedes);
app.get('/hospedes/:id', mostrandoUmHospede)
app.put('/hospedes/:id', atualizandoHospede);
app.delete('/hospede/:id', excluindoHospede);

// Rotas de CRUD de funcionário
app.post('/funcionario', cadastroFuncionario);
app.get('/funcionario', mostrandoFuncionarios);
app.get('/funcionario/:id', mostrandoUmFuncionario);
app.put('/funcionario/:id', atualizandoFuncionario);

// Rotas de CRUD de acomodações
app.post('/acomodacoes', cadastroAcomodacao);
app.get('/acomodacoes', mostrandoAcomodacoes);  // Lista todas as acomodações
app.get('/acomodacoes/:id', mostrandoAcomodacaoPorId);
app.put('/acomodacoes/:id', atualizandoAcomodacao);
app.delete('/acomodacoes/:id', excluindoAcomodacao);
app.get('/acomodacoes/disponiveis/:dataInicio/:dataFim', mostrandoAcomodacoesDisponiveis);
// Rota para verificar a disponibilidade de uma acomodação nas novas datas
app.get('/acomodacoes/disponibilidade/:dataEntrada/:dataSaida/:acomodacaoAtual/:idReserva', verificarDisponibilidadeAcomodacao);

// Rota para bloquear acomodação
app.post("/bloquear", bloquearAcomodacao);
app.post("/acomodacoes/verificar-conflito", verificarConflitoReservas);
// Rota para buscar reservas bloqueadas
app.get('/reservas/bloqueadas', buscarReservasBloqueadas);



// Rotas de CRUD de reserva
app.post('/reservas', cadastroReserva);
app.get('/reservas', mostrandoReservas);
app.get('/reservas/:id', mostrandoUmaReserva);
app.put('/reservas/:id', atualizandoReserva);
app.put('/reservas/:id/status', alterarStatusReserva);

//CRUD Usuario
app.post('/usuario/', criarUsuario);
app.get('/usuario/', mostrarUsuario);
app.get('/usuario/:id_usuario',mostrarUmUsuario);
app.put('/usuario/:id_usuario',atualizarUsuario);

//Rota para Logar
app.post('/logar/',logarUsuario);

// Rota para Home
app.get('/status/:acomodacaoId', buscarStatusReserva);

// Adicione no bloco de rotas
app.get('/relatorios/financeiro', buscarRelatorioFinanceiro);
app.get('/relatorios/previsao-receita', getPrevisaoReceita);
app.get('/relatorios/ocupacao', getRelatorioOcupacao);



app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
