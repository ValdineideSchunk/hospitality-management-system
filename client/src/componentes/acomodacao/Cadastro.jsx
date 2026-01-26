import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Container, Tabs, Tab, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { v4 as uuidv4 } from 'uuid';
import './Cadastro.css';

const CadastroAcomodacao = () => {
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    capacidade: '',
    tipo: '',
    observacoes: '',
    status: 'disponivel',
    wifi: false,
    tv: false,
    arCondicionado: false,
    frigobar: false,
    banheirosAdaptados: false,
    sinalizacaoBraille: false,
    entradaAcessivel: false,
    estacionamentoAcessivel: false,
  });

  const [activeTab, setActiveTab] = useState('acomodacao');
  const navigate = useNavigate();
  const { id } = useParams();

  // Buscar acomodação por ID
  const fetchAcomodacaoById = useCallback(async (id) => {
    try {
      const response = await api.get(`/acomodacoes/${id}`);
      const data = response.data;

      if (response.status !== 200 || !data) {
        alert('Acomodação não encontrada.');
        navigate('/listagem_acomodacoes');
        return;
      }

      setFormData({
        id: data.id,
        nome: data.nome,
        capacidade: data.capacidade,
        tipo: data.tipo,
        observacoes: data.observacoes,
        status: data.status,
        wifi: data.wifi || false,
        tv: data.tv || false,
        arCondicionado: data.arCondicionado || false,
        frigobar: data.frigobar || false,
        banheirosAdaptados: data.banheirosAdaptados || false,
        sinalizacaoBraille: data.sinalizacaoBraille || false,
        entradaAcessivel: data.entradaAcessivel || false,
        estacionamentoAcessivel: data.estacionamentoAcessivel || false,
      });
    } catch (error) {
      alert('Erro ao carregar dados da acomodação.');
      navigate('/listagem_acomodacoes');
    }
  }, [navigate]);

  // Carregar dados da acomodação ao montar ou alterar o ID
  useEffect(() => {
    if (id) {
      fetchAcomodacaoById(id);
    }
  }, [id, fetchAcomodacaoById]);

  // Atualizar estado ao alterar os campos do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  // Validação antes de continuar para a aba de comodidades
  const handleContinue = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.capacidade || !formData.tipo) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setActiveTab('comodidades');
  };

  // Finalizar o cadastro ou edição
  const handleFinalizarCadastro = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.capacidade || !formData.tipo) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (id) {
        await api.put(`/acomodacoes/${id}`, formData);
      } else {
        const newAcomodacao = { ...formData, id: uuidv4() };
        await api.post('/acomodacoes', newAcomodacao);
      }
      navigate('/listagem_acomodacoes');
    } catch (error) {
      alert('Erro ao salvar a acomodação. Tente novamente.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <h2>{id ? 'Editar Acomodação' : 'Nova Acomodação'}</h2>
        </Col>
        <Col className="text-end">
          <Button variant="secondary" onClick={() => navigate('/listagem_acomodacoes')}>
            Voltar
          </Button>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)} className="mb-3">
        <Tab eventKey="acomodacao" title="Acomodação">
          <Form onSubmit={handleContinue}>
            <Form.Group controlId="nome">
              <Form.Label>Nome da Acomodação</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="capacidade">
              <Form.Label>Capacidade</Form.Label>
              <Form.Control
                type="number"
                name="capacidade"
                value={formData.capacidade}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="tipo">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="observacoes">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                as="textarea"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="disponivel">Disponível</option>
                <option value="reservado">Reservado</option>

              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Continuar
            </Button>
          </Form>
        </Tab>

        <Tab eventKey="comodidades" title="Comodidades">
          <h5>Comodidades</h5>
          <Row>
            <Col>
              <Form.Check
                type="checkbox"
                label="Wi-Fi"
                name="wifi"
                checked={formData.wifi}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="TV"
                name="tv"
                checked={formData.tv}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Ar-condicionado"
                name="arCondicionado"
                checked={formData.arCondicionado}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Frigobar"
                name="frigobar"
                checked={formData.frigobar}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                label="Banheiros Adaptados"
                name="banheirosAdaptados"
                checked={formData.banheirosAdaptados}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Sinalização em Braille"
                name="sinalizacaoBraille"
                checked={formData.sinalizacaoBraille}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Entrada Acessível"
                name="entradaAcessivel"
                checked={formData.entradaAcessivel}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Estacionamento Acessível"
                name="estacionamentoAcessivel"
                checked={formData.estacionamentoAcessivel}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Button variant="primary" onClick={handleFinalizarCadastro} className="mt-3">
            Finalizar Cadastro
          </Button>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default CadastroAcomodacao;
