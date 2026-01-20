import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { motion } from "framer-motion"; // Importa o Framer Motion
import logo from "../../img/HF-Logo2.png"; // Atualize para a logo azul.

function Login() {
  const [formData, setFormData] = useState({ login: "", senha: "" });
  const [errors, setErrors] = useState({ login: "", senha: "" });
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    let errorMsg = "";
    if (!/^\d{11}$/.test(value)) {
      errorMsg = "O campo deve conter exatamente 11 dígitos (CPF).";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const validateForm = () => {
    const { login, senha } = formData;
    return (
      login === senha &&
      /^\d{11}$/.test(login) &&
      !errors.login &&
      !errors.senha
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  async function efetuarLogin() {
    setIsLoading(true);
    try {
      const resposta = await fetch("http://localhost:5000/logar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf: formData.login }),
      });

      if (!resposta.ok) {
        const errorData = await resposta.json();
        throw new Error(errorData.message || "Erro ao efetuar login");
      }

      const data = await resposta.json();

      if (data && data.nome_funcionario) {
        localStorage.setItem("userId", data.id_funcionario);
        localStorage.setItem("userName", data.nome_funcionario);
        localStorage.setItem("userCargo", data.cargo);
        localStorage.setItem("userCPF", formData.login);
        setAuthError("");
        window.location.href = "http://localhost:3000/home";
      } else {
        setAuthError("Erro inesperado: Nome do usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao efetuar login:", error);
      setAuthError("CPF ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      efetuarLogin();
    } else {
      setAuthError("Login e senha devem ser válidos.");
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "#ffffff",
      }}
    >
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {authError && <Alert variant="danger">{authError}</Alert>}

            <Form
              onSubmit={handleSubmit}
              className="p-4 rounded shadow"
              style={{
                background: "linear-gradient(135deg, #006bb4, #003f7f)",
                border: "1px solid #e0e0e0",
                color: "#ffffff",
              }}
            >
              <div className="text-center mb-4">
                <img
                  src={logo}
                  alt="Logo Hospeda Facil"
                  style={{
                    maxWidth: "100%",
                    filter: "drop-shadow(2px 2px 5px #003f7f)",
                  }}
                />
              </div>
              <h2
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                Bem-vindo a Hospeda Fácil
              </h2>

              <Form.Group
                className="mb-3"
                controlId="formLogin"
                style={{ fontWeight: "bold" }}
              >
                <Form.Label>CPF</Form.Label>
                <Form.Control
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  isInvalid={!!errors.login}
                  placeholder="Digite seu CPF"
                  maxLength={11}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.login}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="formSenha"
                style={{ fontWeight: "bold" }}
              >
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  isInvalid={!!errors.senha}
                  placeholder="Digite sua senha"
                  maxLength={11}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.senha}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={isLoading}
                style={{
                  backgroundColor: "#006bb4",
                  borderColor: "#006bb4",
                  fontWeight: "bold",
                }}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "ENTRAR"
                )}
              </Button>
            </Form>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
