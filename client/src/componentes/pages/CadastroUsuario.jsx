import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function CadastroUsuario() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  // Carregar lista de funcionários
  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      const response = await api.get("/funcionario");
      // Filtrar apenas funcionários ativos (case-insensitive). Se status vazio, mostrar também.
      const funcionariosAtivos = response.data.filter((f) => {
        const status = (f.status_funcionario || "").toLowerCase();
        return status === "ativo" || status === "";
      });
      setFuncionarios(funcionariosAtivos);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
      setMensagem({
        tipo: "danger",
        texto: "Erro ao carregar lista de funcionários",
      });
    }
  };

  const validarFormulario = () => {
    if (!funcionarioSelecionado) {
      setMensagem({ tipo: "danger", texto: "Selecione um funcionário" });
      return false;
    }

    if (!senha || senha.length < 4) {
      setMensagem({
        tipo: "danger",
        texto: "A senha deve ter no mínimo 4 caracteres",
      });
      return false;
    }

    if (senha !== confirmarSenha) {
      setMensagem({ tipo: "danger", texto: "As senhas não coincidem" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: "", texto: "" });

    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);

    try {
      const response = await api.post("/usuario", {
        id_funcionario: funcionarioSelecionado,
        senha: senha,
      });

      setMensagem({
        tipo: "success",
        texto: `Usuário criado com sucesso! Login: ${response.data.login}`,
      });

      // Limpar formulário
      setFuncionarioSelecionado("");
      setSenha("");
      setConfirmarSenha("");

      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate("/tabela_funcionarios");
      }, 3000);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      setMensagem({
        tipo: "danger",
        texto: error.response?.data?.message || "Erro ao criar usuário",
      });
    } finally {
      setCarregando(false);
    }
  };

  const getFuncionarioInfo = () => {
    const funcionario = funcionarios.find(
      (f) => f.id_funcionario === parseInt(funcionarioSelecionado)
    );
    return funcionario;
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h4" className="bg-primary text-white">
          🔐 Cadastrar Novo Usuário do Sistema
        </Card.Header>
        <Card.Body>
          {mensagem.texto && (
            <Alert variant={mensagem.tipo} dismissible onClose={() => setMensagem({ tipo: "", texto: "" })}>
              {mensagem.texto}
            </Alert>
          )}

          <Alert variant="info">
            <strong>ℹ️ Informações:</strong>
            <ul className="mb-0 mt-2">
              <li>Selecione um funcionário ativo para criar acesso ao sistema</li>
              <li>O <strong>CPF do funcionário</strong> será usado como login</li>
              <li>Defina uma senha segura (mínimo 4 caracteres)</li>
              <li>Cada funcionário pode ter apenas um usuário</li>
            </ul>
          </Alert>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Funcionário *</strong>
              </Form.Label>
              <Form.Select
                value={funcionarioSelecionado}
                onChange={(e) => setFuncionarioSelecionado(e.target.value)}
                required
              >
                <option value="">Selecione um funcionário...</option>
                {funcionarios.map((func) => (
                  <option key={func.id_funcionario} value={func.id_funcionario}>
                    {func.nome_funcionario} - {func.cpf} ({func.cargo})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {getFuncionarioInfo() && (
              <Alert variant="secondary">
                <strong>Login será:</strong> {getFuncionarioInfo().cpf}
                <br />
                <strong>Nome:</strong> {getFuncionarioInfo().nome_funcionario}
                <br />
                <strong>Cargo:</strong> {getFuncionarioInfo().cargo}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Senha *</strong>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite uma senha (mínimo 4 caracteres)"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={4}
              />
              <Form.Text className="text-muted">
                Mínimo de 4 caracteres. Recomendamos usar letras e números.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Confirmar Senha *</strong>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                minLength={4}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={carregando}
              >
                {carregando ? "Criando..." : "✅ Criar Usuário"}
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate("/tabela_funcionarios")}
                disabled={carregando}
              >
                ❌ Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CadastroUsuario;
