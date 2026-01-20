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
    data_nascimento: '',
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
      observacoes_endereco: '',
    },
    adicionais: {
      cargo: '',
      data_admissao: '',
      data_emissao_carteira: '',
      banco: '',
      agencia: '',
      conta: '',
      status: '',
      observacoes_adicionais: '',
    },
  });

  function formatDateToInput(isoString) {
    if (!isoString) return ''; // Verifique se a data está presente
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  
  const [loading, setLoading] = useState(true); // Estado de carregamento enquanto os dados são buscados

  useEffect(() => {
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
  
        // Log para depuração
        console.log('Dados do funcionário:', dadosFuncionario);
  
        // Formatar as datas recebidas, mas apenas se a data existir
        dadosFuncionario.data_nascimento = formatDateToInput(dadosFuncionario.data_nascimento);
        dadosFuncionario.adicionais.data_admissao = formatDateToInput(dadosFuncionario.adicionais.data_admissao);
        dadosFuncionario.adicionais.data_emissao_carteira = formatDateToInput(dadosFuncionario.adicionais.data_emissao_carteira);
  
        setFormData(dadosFuncionario); // Preenche os dados do funcionário no formulário
        console.log('Dados após formatação:', dadosFuncionario);
        setLoading(false); // Define que o carregamento foi concluído
      } catch (error) {
        console.error('Erro ao buscar funcionário', error);
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
          console.error('Erro ao atualizar funcionário:', errorData || 'Erro desconhecido');
          throw new Error(errorData.message || 'Erro desconhecido');
        }

        navigate('/Tabela_Funcionarios'); // Redireciona para a tabela de funcionários após salvar
      } catch (error) {
        console.error('Erro ao atualizar funcionário', error);
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
    <div className="container mt-4">
      <h2>Editar Funcionário</h2>

      <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="informacoes">Informações do Funcionário</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="endereco">Endereço</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="adicionais">Adicionais</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <FormFuncionario
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
          variant="primary"
          className="mt-2"
          type="submit"
          onClick={handleSubmit} // Chama handleSubmit ao clicar em "Salvar"
        >
          {activeTab === 'adicionais' ? 'Salvar' : 'Continuar'}
        </Button>
      </div>
    </div>
  );
}

export default EdtFuncionario;
