import {
  createHospede,
  updateHospede,
  deleteHospede,
  readHospedes,
  getOneHospede,
  verificarCPF,
} from '../models/HospedeModel.js';

export async function cadastroHospede(req, res) {
  console.log('HospedeController cadastroHospede');
  const hospede = req.body;

  console.log('Dados recebidos do frontend:', hospede);
  try {
    const [status, resposta] = await createHospede(hospede);
    res.status(status).json(resposta);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function mostrandoHospedes(req, res) {
  console.log('HospedeController mostrandoHospedes');

  try {
    const [status, resposta] = await readHospedes();
    res.status(status).json(resposta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao recuperar hóspedes', error });
  }
}

export async function mostrandoUmHospede(req, res) {
  console.log('HospedeController mostrandoUmHospede');
  const { id } = req.params;

  try {
    const [status, resposta] = await getOneHospede(id);
    return res.status(status).json(resposta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao buscar hóspede', error });
  }
}

export async function atualizandoHospede(req, res) {
  console.log('HospedeController AtulizandoHospede');
  const { id } = req.params;
  const hospede = req.body;
  console.log(hospede);

  try {
    const [status, resposta] = await updateHospede(hospede, id);
    res.status(status).json(resposta);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function excluindoHospede(req, res) {
  console.log('HospedeController excluindoHospede');
  const { id } = req.params;

  try {
    const [status, resposta] = await deleteHospede(id);
    res.status(status).json(resposta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao excluir o hóspede', error });
  }
}

export async function verificandoCPF(req, res) {
  console.log('HospedeController verificandoCPF');
  const { cpf } = req.params;

  try {
    const [status, resposta] = await verificarCPF(cpf);
    res.status(status).json(resposta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao verificar CPF', error });
  }
}
