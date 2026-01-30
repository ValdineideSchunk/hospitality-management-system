import {
  createUsuario,
  readUsuario,
  showOneUsuario,
  updateUsuario,
  deleteUsuario,
  getUserByLoginPassword,
  getUserByCPFWithPassword,
} from "../models/usuarioModel.js";
import { gerarToken } from "../middlewares/authMiddleware.js";

export async function criarUsuario(req, res) {
  console.log("UsuarioController :: criarUsuario");

  const { id_funcionario, senha } = req.body;

  // Validar se os dados foram informados
  if (!id_funcionario || !senha) {
    return res.status(400).json({ 
      message: "ID do funcionário e senha devem ser informados" 
    });
  }

  // Validar tamanho mínimo da senha
  if (senha.length < 4) {
    return res.status(400).json({ 
      message: "A senha deve ter no mínimo 4 caracteres" 
    });
  }

  try {
    const [status, resposta] = await createUsuario(id_funcionario, senha);
    return res.status(status).json(resposta);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({
      message: "Erro ao criar usuário",
      details: error.message,
    });
  }
}


export async function mostrarUsuario(req, res) {
  console.log("UsuarioController :: mostrarUsuario");

  try {
    const [status, resposta] = await readUsuario();
    res.status(status).json(resposta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao exibir usuários" });
  }
}

export async function mostrarUmUsuario(req, res) {
  console.log("UsuarioController :: mostrarUmUsuario");
  const { id_usuario } = req.params;

  if (!id_usuario) {
    res.status(400).json({ message: "ID do usuário deve ser informado" });
  } else {
    try {
      const [status, resposta] = await showOneUsuario(id_usuario);
      res.status(status).json(resposta);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao exibir o usuário" });
    }
  }
}

export async function atualizarUsuario(req, res) {
  console.log("UsuarioController :: atualizarUsuario");
  const { login, senha } = req.body;
  const { id_usuario } = req.params;

  if (!login || !senha || !id_usuario) {
    res.status(400).json({ message: "Login, senha e ID do usuário devem ser informados" });
  } else {
    try {
      const [status, resposta] = await updateUsuario(login, senha, id_usuario);
      res.status(status).json(resposta);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  }
}


// Controlador (UsuarioController.js)
export async function logarUsuario(req, res) {
  console.log("UsuarioController :: logarUsuario");

  const { cpf, senha } = req.body;

  // Verifica se o CPF e senha foram informados
  if (!cpf || !senha) {
    return res.status(400).json({ message: "CPF e senha devem ser informados" });
  }

  try {
    // Chama a função para autenticar o usuário com validação de senha
    const [status, resposta] = await getUserByCPFWithPassword(cpf, senha);

    if (status === 200) {
      // Gera o token JWT
      const token = gerarToken({
        id_funcionario: resposta.id_funcionario,
        cpf: resposta.cpf,
        cargo: resposta.cargo,
        nome_funcionario: resposta.nome_funcionario
      });

      // Retorna o token e dados básicos do usuário
      return res.status(200).json({
        message: "Login realizado com sucesso",
        token,
        usuario: {
          id_funcionario: resposta.id_funcionario,
          nome_funcionario: resposta.nome_funcionario,
          cargo: resposta.cargo
        }
      });
    } else {
      return res.status(status).json(resposta);
    }
  } catch (error) {
    console.log("Erro ao realizar login:", error);
    return res.status(500).json({ message: "Erro ao realizar login", details: error.message });
  }
}

