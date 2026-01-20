import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Button, Modal, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ListaAcomodacoesBloqueadas() {
  const [acomodacoesBloqueadas, setAcomodacoesBloqueadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  // Função para buscar acomodações bloqueadas
  const fetchAcomodacoesBloqueadas = async () => {
    try {
      const response = await fetch('http://localhost:5000/reservas/bloqueadas'); // Endpoint do backend
      if (!response.ok) {
        throw new Error('Erro ao buscar acomodações bloqueadas');
      }
      const data = await response.json();
      setAcomodacoesBloqueadas(data);
    } catch (error) {
      console.error('Erro ao buscar acomodações bloqueadas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para desbloquear uma acomodação
  const handleDesbloquear = async () => {
    if (!selectedId) return;

    try {
      const resposta = await fetch(`http://localhost:5000/reservas/${selectedId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ novoStatus: 'desbloqueada' }), // Campo conforme esperado pelo backend
      });

      if (!resposta.ok) {
        const errorMessage = await resposta.text();
        throw new Error(`Erro ao atualizar status da reserva ${selectedId}: ${errorMessage}`);
      }

      console.log(`Status da reserva ${selectedId} atualizado para "desbloqueada" com sucesso.`);

      // Recarrega a página
      fetchAcomodacoesBloqueadas();
    } catch (error) {
      console.error(`Erro ao atualizar status da reserva ${selectedId}:`, error);
    } finally {
      setShowConfirmation(false); // Fecha o modal de confirmação
      setSelectedId(null);
    }
  };

  // Abre o modal de confirmação
  const openConfirmationModal = (id) => {
    setSelectedId(id);
    setShowConfirmation(true);
  };

  // Carregar acomodações bloqueadas ao montar o componente
  useEffect(() => {
    fetchAcomodacoesBloqueadas();
  }, []);

  return (
    <Container className="mt-5">
      <Row className="justify-content-between align-items-center mb-3">
        <Col>
          <h2>Acomodações Bloqueadas</h2>
        </Col>
        <Col className="text-end">
          <Button
            variant="secondary"
            onClick={() => navigate('/listagem_acomodacoes')}
          >
            Fechar
          </Button>
        </Col>
      </Row>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID do Bloqueio</th>
              <th>Nome da Acomodação</th>
              <th>Responsável</th>
              <th>Data Início do Bloqueio</th>
              <th>Data Fim do Bloqueio</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {acomodacoesBloqueadas.length > 0 ? (
              acomodacoesBloqueadas.map((item, index) => (
                <tr key={index}>
                  <td>{item.id_reserva}</td> {/* ID do Bloqueio */}
                  <td>{item.nome_acomodacao}</td>
                  <td>{item.nome_hospede}</td> {/* Agora é Responsável */}
                  <td>{new Date(item.data_checkin).toLocaleDateString()}</td>
                  <td>{new Date(item.data_checkout).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openConfirmationModal(item.id_reserva)} // Abre o modal com o ID da reserva
                    >
                      Desbloquear
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Nenhuma acomodação bloqueada encontrada.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal de Confirmação */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Ação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja desbloquear esta acomodação?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDesbloquear}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ListaAcomodacoesBloqueadas;
