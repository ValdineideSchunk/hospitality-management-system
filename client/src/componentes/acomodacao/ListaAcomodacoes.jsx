import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ListaAcomodacoes.css';

const ListagemAcomodacoes = ({ textoBotao = "Editar", onSelectAcomodacao, dataInicio, dataFim }) => {
  const [acomodacoes, setAcomodacoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Buscar todas as acomodações
  const fetchAcomodacoes = async () => {
    try {
      let response;
      if (dataInicio && dataFim) {
        response = await api.get(`/acomodacoes/disponiveis/${dataInicio}/${dataFim}`);
      } else {
        response = await api.get('/acomodacoes');
      }
      const validAcomodacoes = response.data.filter(Boolean);
      setAcomodacoes(validAcomodacoes);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchAcomodacoes();
  }, [dataInicio, dataFim]);

  const filteredAcomodacoes = acomodacoes.filter((acomodacao) => {
    return (
      acomodacao?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acomodacao?.id?.toString().includes(searchTerm) ||
      acomodacao?.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getComodidades = (acomodacao) => {
    const comodidades = [];
    if (acomodacao.wifi) comodidades.push('Wi-Fi');
    if (acomodacao.tv) comodidades.push('TV');
    if (acomodacao.arCondicionado) comodidades.push('Ar-condicionado');
    if (acomodacao.frigobar) comodidades.push('Frigobar');
    if (acomodacao.banheirosAdaptados) comodidades.push('Banheiros Adaptados');
    if (acomodacao.sinalizacaoBraille) comodidades.push('Sinalização em Braille');
    if (acomodacao.entradaAcessivel) comodidades.push('Entrada Acessível');
    if (acomodacao.estacionamentoAcessivel) comodidades.push('Estacionamento Acessível');

    return comodidades.length > 0 ? comodidades.join(', ') : 'Sem comodidades';
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <h2>Acomodações</h2>
          {!dataInicio && !dataFim && (
            <>
              <Button size="sm" variant="danger" onClick={() => navigate('/acomodacoes_bloqueadas')}>
                Ver Acomodações Bloqueadas
              </Button>
              <Button size="sm" variant="danger" onClick={() => navigate('/bloquear_acomodacao')}>
                Bloquear Acomodação
              </Button>
              <Button size="sm" variant="primary" onClick={() => navigate('/cadastro_acomodacao')}>
                Nova Acomodação
              </Button>
            </>
          )}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Pesquisar por nome, ID ou tipo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead className="table-header">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Capacidade</th>
            <th>Tipo</th>
            <th>Observações</th>
            <th>Comodidades</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAcomodacoes.length > 0 ? (
            filteredAcomodacoes.map((acomodacao) => (
              <tr key={acomodacao.id}>
                <td>{acomodacao.id}</td>
                <td>{acomodacao.nome}</td>
                <td>{acomodacao.capacidade}</td>
                <td>{acomodacao.tipo}</td>
                <td>{acomodacao.observacoes}</td>
                <td>{getComodidades(acomodacao)}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (textoBotao === 'Selecionar') {
                        onSelectAcomodacao(acomodacao);
                      } else if (textoBotao === 'Editar') {
                        navigate(`/editar_acomodacao/${acomodacao.id}`);
                      }
                    }}
                    className="me-2"
                  >
                    {textoBotao}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Nenhuma acomodação disponível para as datas informadas.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListagemAcomodacoes;
