import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tab, Nav, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { buscarEnderecoPorCep } from '../../../services/viaCepService.js';
import './FormCadFuncionario.css';
import FormFuncionario from './FormFuncionario';
import Alertas from '../../layout/Alertas';

function FormCadFuncionario({ handleSubmit }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('informacoes');
  const [alertProps, setAlertProps] = useState({
    show: false,
    message: '',
    variant: 'danger',
  });

  const showAlert = (message, variant) => {
    setAlertProps({ show: true, message, variant });
    setTimeout(() => setAlertProps((prev) => ({ ...prev, show: false })), 5000);
  };
  const [formData, setFormData] = useState({
    nome_funcionario: '',
    cpf: '',
    rg: '',
    data_nascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    observacoes: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    logradouro: '',
    numero: '',
    complemento: '',
    observacoes_endereco: '',
    cargo: '',
    dataAdmissao: '',
    dataEmissaoCarteira: '',
    banco: '',
    agencia: '',
    conta: '',
    status_funcionario: '',
    observacoesAdicionais: '',
  });

 
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:5000/funcionario/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar os dados');
        }
        const data = await response.json();
  
        setFormData({
          nome_funcionario: data.nome_funcionario || '',
          cpf: data.cpf || '',
          rg: data.rg || '',
          data_nascimento: data.data_nascimento || '',
          sexo: data.sexo || '',
          email: data.email || '',
          telefone: data.telefone || '',
          observacoes: data.observacoes || '',
          
            cep: data.cep || '',
            estado: data.estado || '',
            cidade: data.cidade || '',
            bairro: data.bairro || '',
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            observacoes_endereco: data.observacoes_endereco || '',
          
         
            cargo: data.cargo || '',
            data_admissao: data.data_admissao || '',
            data_emissao_carteira: data.data_emissao_carteira || '',
            banco: data.banco || '',
            agencia: data.agencia || '',
            conta: data.conta || '',
            status_funcionario: data.status_funcionario || '',
            observacoes_adicionais: data.observacoes_adicionais || '',
          
        });
      } catch (error) {
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Verifica se o campo alterado é o CEP e chama a função de busca de endereço
    if (name === 'cep') {
      // Remove formatação e verifica se tem 8 dígitos
      const cepLimpo = value.replace(/\D/g, '');
      if (cepLimpo.length === 8) {
        handleBuscarCep(cepLimpo);
      }
    }
  };

  // Função para buscar o endereço pelo CEP
  const handleBuscarCep = async (cep) => {
    const resultado = await buscarEnderecoPorCep(cep);

    if (!resultado.erro) {
      // Preenche os campos automaticamente com nomes que correspondem ao FormFuncionario
      setFormData((prevData) => ({
        ...prevData,
        estado: resultado.endereco.estado || '',
        cidade: resultado.endereco.cidade || '',
        bairro: resultado.endereco.bairro || '',
        logradouro: resultado.endereco.rua || '',
        complemento: resultado.endereco.complemento || '',
      }));
      showAlert(resultado.mensagem, 'success');
    } else {
      // Exibe mensagem de erro
      const variante = resultado.tipo || 'danger';
      showAlert(resultado.mensagem, variante);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (activeTab === 'adicionais') {
      handleSubmit(formData);
      navigate('/Tabela_Funcionarios');
    } else {
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

  return (
    <div className="container mt-4 ">
      <Alertas
        show={alertProps.show}
        variant={alertProps.variant}
        message={alertProps.message}
        onClose={() => setAlertProps((prev) => ({ ...prev, show: false }))}
      />
      <div className="">
        <h2 style={{ marginLeft: '50px' }}>Novo Funcionário</h2>
      </div>
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

        <Tab.Content>
          <FormFuncionario
            formData={formData}
            handleChange={handleChange}
          />
        </Tab.Content>
      </Tab.Container>

      <div className="text-center mt-4">
        <Button
          variant="danger"
          className="mt-2 me-2"
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
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

export default FormCadFuncionario;
