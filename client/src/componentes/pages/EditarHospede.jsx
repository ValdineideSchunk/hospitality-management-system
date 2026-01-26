import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, Nav, Button } from 'react-bootstrap';
import FormHospede from '../Hospedes/FormCadHospedes/FormHospedes';

function EditarHospede() {
  const { id } = useParams(); // Captura o ID do hóspede da URL
  const navigate = useNavigate(); // Para navegação
  const [activeTab, setActiveTab] = useState('informacoes'); // Controla as abas ativas
  const [formData, setFormData] = useState({
    nome_hospede: '',
    cpf: '',
    rg: '',
    data_nascimento: '',
    sexo: '',
    profissao: '',
    observacoes: '',
    rua: '',
    numero: '',
    cidade: '',
    estado: '',
    cep: '',
    bairro: '',
    complemento: '',
    observacoes_endereco: '',
    email: '',
    celular: '',
  });
  const [loading, setLoading] = useState(true); // Para mostrar o status de carregamento

  useEffect(() => {
    // Função para buscar dados do hóspede pelo ID
    async function buscarHospede() {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const resposta = await fetch(`${apiUrl}/hospedes/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!resposta.ok) {
          throw new Error('Erro ao buscar hóspede');
        }

        const dadosHospede = await resposta.json();
        setFormData(dadosHospede); // Preenche os dados do hóspede no formulário
        setLoading(false);
      } catch (error) {
      }
    }

    buscarHospede();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (activeTab === 'adicionais') {
      // Última aba, envia o formulário
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const resposta = await fetch(`${apiUrl}/hospedes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData), // Envia os dados atualizados
        });

        if (!resposta.ok) {
          throw new Error('Erro ao atualizar hóspede');
        }

        navigate('/Tabela_Hospedes'); // Redireciona para a tabela de hóspedes após salvar
      } catch (error) {
      }
    } else {
      // Muda para a próxima aba
      if (activeTab === 'informacoes') {
        setActiveTab('endereco');
      } else if (activeTab === 'endereco') {
        setActiveTab('adicionais');
      }
    }
  };

  const handleCancel = () => {
    navigate('/Tabela_Hospedes'); // Redireciona para a página TabelaHóspedes
  };

  if (loading) {
    return <p>Carregando...</p>; // Exibe uma mensagem de carregamento
  }

  return (
    <div className="container mt-4">
      <h2>Editar Hóspede</h2>

      <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="informacoes">Informações do Hóspede</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="endereco">Endereço</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="adicionais">Adicionais</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <FormHospede
            formData={formData} // Passa os dados do formulário para o componente
            handleChange={handleChange} // Função para manipular mudanças
          />
        </Tab.Content>
      </Tab.Container>

      <div className="text-center mt-4">
        <Button
          variant="danger"
          className="mt-2 me-2"
          onClick={handleCancel} // Chama handleCancel ao clicar
        >
          Cancelar
        </Button>
        <Button
          variant="primary" // Botão de salvar ou continuar
          className="mt-2"
          type="submit"
          onClick={submit}
        >
          {activeTab === 'adicionais' ? 'Salvar' : 'Continuar'}
        </Button>
      </div>
    </div>
  );
}

export default EditarHospede;
