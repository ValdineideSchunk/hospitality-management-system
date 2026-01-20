import {
  createUsuario,
  readUsuario,
  showOneUsuario,
  updateUsuario,
  deleteUsuario,
  getUserByLoginPassword,
} from "../models/usuarioModel.js";

export async function criarUsuario(req, res) {
  console.log("UsuarioController :: criarUsuario");

  const { cpf } = req.body;

  // Validar se o CPF foi informado
  if (!cpf) {
    return res.status(400).json({ message: "CPF deve ser informado" });
  }

  try {
    // Verificar se o funcionário existe
    const [status, resposta] = await getUserByLoginPassword(cpf);

    if (status === 200) {
      return res.status(200).json({
        message: "Usuário autenticado com sucesso",
        dados: resposta,
      });
    } else {
      return res.status(status).json(resposta);
    }
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    return res.status(500).json({
      message: "Erro ao autenticar usuário",
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

  const { cpf } = req.body;

  // Verifica se o CPF foi informado
  if (!cpf) {
    return res.status(400).json({ message: "CPF deve ser informado" });
  }

  try {
    // Chama a função para autenticar o usuário
    const [status, resposta] = await getUserByLoginPassword(cpf);

    return res.status(status).json(resposta);
  } catch (error) {
    console.log("Erro ao realizar login:", error);
    return res.status(500).json({ message: "Erro ao realizar login", details: error.message });
  }
}

