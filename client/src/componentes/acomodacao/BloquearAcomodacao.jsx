import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function BloquearAcomodacao() {
  const [acomodacaoId, setAcomodacaoId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [motivo, setMotivo] = useState("");
  const [message, setMessage] = useState("");
  const [funcionario, setFuncionario] = useState({ id: "", nome: "" });
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Recupera os dados do funcionário do contexto de autenticação
  useEffect(() => {
    if (usuario) {
      setFuncionario({ id: usuario.id_funcionario, nome: usuario.nome_funcionario });
    } else {
      setMessage("Erro: Funcionário não autenticado.");
    }
  }, [usuario]);

  async function handleBloquear() {
    try {
      if (!funcionario.id) {
        setMessage("Erro: Funcionário não autenticado.");
        return;
      }

      if (!acomodacaoId || !dataInicio || !dataFim || !motivo) {
        setMessage("Por favor, preencha todos os campos.");
        return;
      }

      // Verificar se existem reservas conflitantes
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const verificarResponse = await fetch(
        `${apiUrl}/acomodacoes/verificar-conflito`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            acomodacaoId,
            dataInicio,
            dataFim,
          }),
        }
      );

      const verificarData = await verificarResponse.json();

      if (verificarData.conflito) {
        setMessage(
          `Existem reservas em aberto para a acomodação no período de ${dataInicio} a ${dataFim}.`
        );
        return; // Interrompe o fluxo se houver conflitos
      }

      // Se não houver conflitos, realiza o bloqueio
      const response = await fetch(`${apiUrl}/bloquear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acomodacaoId,
          funcionarioId: funcionario.id,
          dataInicio,
          dataFim,
          motivo,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Acomodação ${acomodacaoId} bloqueada com sucesso!`);

        // Redireciona após 3 segundos
        setTimeout(() => {
          navigate("/acomodacoes_bloqueadas");
        }, 3000);
      } else {
        setMessage(`Erro ao bloquear acomodação: ${data.message}`);
      }
    } catch (error) {
      setMessage("Erro ao tentar bloquear a acomodação.");
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h3 className="text-center mb-4">Bloquear Acomodação</h3>

          {/* Mensagem de Feedback */}
          {message && <Alert variant={message.includes("sucesso") ? "success" : "danger"}>{message}</Alert>}

          <Form>
            {/* ID do Usuário */}
            <Form.Group className="mb-3">
              <Form.Label>ID do Usuário</Form.Label>
              <Form.Control type="text" value={funcionario.id} disabled />
            </Form.Group>

            {/* Nome do Usuário */}
            <Form.Group className="mb-3">
              <Form.Label>Nome do Usuário</Form.Label>
              <Form.Control type="text" value={funcionario.nome} disabled />
            </Form.Group>

            {/* ID da Acomodação */}
            <Form.Group className="mb-3">
              <Form.Label>ID da Acomodação</Form.Label>
              <Form.Control
                type="text"
                value={acomodacaoId}
                onChange={(e) => setAcomodacaoId(e.target.value)}
                placeholder="Digite o ID da Acomodação"
              />
            </Form.Group>

            {/* Data de Início */}
            <Form.Group className="mb-3">
              <Form.Label>Data Início do Bloqueio</Form.Label>
              <Form.Control
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </Form.Group>

            {/* Data de Fim */}
            <Form.Group className="mb-3">
              <Form.Label>Data Fim do Bloqueio</Form.Label>
              <Form.Control
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </Form.Group>

            {/* Motivo */}
            <Form.Group className="mb-3">
              <Form.Label>Motivo do Bloqueio</Form.Label>
              <Form.Control
                as="textarea"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Descreva o motivo do bloqueio"
              />
            </Form.Group>

            {/* Botão de Bloquear */}
            <Button variant="primary" className="w-100 mb-2" onClick={handleBloquear}>
              Bloquear Acomodação
            </Button>

            {/* Botão de Cancelar */}
            <Button
              variant="secondary"
              className="w-100"
              onClick={() => navigate("/listagem_acomodacoes")}
            >
              Cancelar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default BloquearAcomodacao;
