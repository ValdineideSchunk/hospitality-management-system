import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, Nav, Button } from 'react-bootstrap';
import FormFuncionario from '../Funcionarios/FormCadFuncionario/FormFuncionario';


function EditarFuncionario() {
  const { id } = useParams(); // Captura o ID do funcionário da URL
  const navigate = useNavigate(); // Função para navegação entre páginas
  const [activeTab, setActiveTab] = useState('informacoes'); // Controla a aba ativa
  const [formData, setFormData] = useState({
    nome_funcionario: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    observacoes: '',
    endereco: {
      cep: '',
      estado: '',
      cidade: '',
      bairro: '',
      logradouro: '',
      numero: '',
      complemento: '',
      observacoesEndereco: '',
    },
    adicionais: {
      cargo: '',
      dataAdmissao: '',
      dataEmissaoCarteira: '',
      banco: '',
      agencia: '',
      conta: '',
      status: '',
      observacoesAdicionais: '',
    },
  });
  const [loading, setLoading] = useState(true); // Estado de carregamento enquanto os dados são buscados

  useEffect(() => {
    // Função para buscar dados do funcionário pelo ID
    async function buscarFuncionario() {
      try {
        const resposta = await fetch(`http://localhost:5000/funcionario/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!resposta.ok) {
          throw new Error('Erro ao buscar funcionário');
        }

        const dadosFuncionario = await resposta.json();
        setFormData(dadosFuncionario); // Preenche os dados do funcionário no formulário
        setLoading(false); // Define que o carregamento foi concluído
      } catch (error) {
      }
    }

    buscarFuncionario();
  }, [id]);

  // Função para manipular as mudanças no formulário, incluindo campos de endereço e adicionais
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('endereco')) {
      setFormData((prevState) => ({
        ...prevState,
        endereco: {
          ...prevState.endereco,
          [name.split('.')[1]]: value,
        },
      }));
    } else if (name.startsWith('adicionais')) {
      setFormData((prevState) => ({
        ...prevState,
        adicionais: {
          ...prevState.adicionais,
          [name.split('.')[1]]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Função de envio do formulário, que atualiza os dados do funcionário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se estamos na aba 'adicionais' para salvar os dados
    if (activeTab === 'adicionais') {
      try {
        const resposta = await fetch(`http://localhost:5000/funcionario/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData), // Envia os dados atualizados
        });

        if (!resposta.ok) {
          const errorData = await resposta.json();
          throw new Error(errorData.message || 'Erro desconhecido');
        }

        navigate('/Tabela_Funcionarios'); // Redireciona para a tabela de funcionários após salvar
      } catch (error) {
      }
    } else {
      // Muda para a próxima aba, conforme a aba atual
      if (activeTab === 'informacoes') {
        setActiveTab('endereco');
      } else if (activeTab === 'endereco') {
        setActiveTab('adicionais');
      }
    }
  };

  const handleCancel = () => {
    navigate('/Tabela_Funcionarios'); // Redireciona para a página TabelaFuncionarios
  };

  if (loading) {
    return <p>Carregando...</p>; // Exibe uma mensagem de carregamento
  }

  return (
    <div className="d-flex">
      <div className="container mt-4">
        <h2 style={{ marginLeft: '50px' }}>Editando Funcionário</h2>
        {/* Configura as abas para navegar entre diferentes seções do formulário */}
        <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="informacoes" className="p-1 fs-6">Informações do Funcionário</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="endereco" className="p-1 fs-6">Endereço</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="adicionais" className="p-1 fs-6">Adicionais</Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Renderiza o formulário de edição usando o componente FormFuncionario */}
          <Tab.Content>
            <FormFuncionario
              formData={formData}
              handleChange={handleChange}
            />
          </Tab.Content>
        </Tab.Container>

        {/* Botões para cancelar ou avançar no formulário */}
        <div className="text-center mt-4">
          <Button
            variant="danger"
            className="mt-2 me-2"
            onClick={handleCancel} // Chama handleCancel ao clicar
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="mt-2"
            type="submit"
            onClick={handleSubmit} // Chama handleSubmit ao clicar
          >
            {activeTab === 'adicionais' ? 'Salvar' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditarFuncionario;
