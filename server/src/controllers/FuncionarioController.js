import {createFuncionario, readFuncionario, updateFuncionario, getOneFuncionario} from '../models/FuncionarioModel.js';
import {isNullOrEmpty,validateFuncionario} from '../validations/FuncionarioValidations.js';


//Cadastrando Funcionario
export async function cadastroFuncionario(req, res) {
  console.log('FuncionarioController cadastroFuncionario');
  const funcionario = req.body;

  console.log('Dados recebidos do frontend:', funcionario); // Log dos dados recebidos

  if (validateFuncionario(funcionario)) {
    res
      .status(400)
      .json({ mensagem: 'Funcionario não pode ter campos vazios' });
  } else {
    try {
      const [status, resposta] = await createFuncionario(funcionario);
      res.status(status).json(resposta);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

// Mostrando todos os funcionarios
export async function mostrandoFuncionarios(req, res) {
  console.log('FuncionarioController mostrandoFuncionarios');
  try {
      const [status, resposta] = await readFuncionario();
      res.status(status).json(resposta);
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
}

// exibindo um funcionario
export async function mostrandoUmFuncionario(req, res) {
  console.log('FuncionarioController mostrandoUmFuncionario');
  const { id } = req.params;

  if (isNullOrEmpty(id)) {
      res.status(400).json({ mensagem: 'O ID deve ser preenchido' });
  } else {
      try {
          const [status, resposta] = await getOneFuncionario(id);
          res.status(status).json(resposta);
      } catch (error) {
          console.error(error);
          res.status(500).json(error);
      }
  }
}

// Atualizando um Funcionario
export async function atualizandoFuncionario(req, res) {
  console.log('FuncionarioController AtualizandoFuncionario');

  const { id } = req.params;
  const funcionario = req.body;
  console.log ("function atualizandoFuncionario",funcionario)
  // Verifique se o corpo da requisição não está indefinido
  if (!funcionario || typeof funcionario !== 'object' || Array.isArray(funcionario)) {
    return res.status(400).json({ mensagem: 'Dados do funcionário não estão válidos' });
  }

  // Valide os dados do funcionário e se o ID não é nulo ou vazio
  if (validateFuncionario(funcionario) || isNullOrEmpty(id)) {
    return res.status(400).json({ mensagem: 'Funcionário não pode ter campos vazios' });
  }

  try {
    const [status, resposta] = await updateFuncionario(funcionario, id);
    res.status(status).json(resposta);
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar funcionário', erro: error.message });
  }
}

