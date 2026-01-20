import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tab, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { txtHospede } from "../../../services/txtHospede.js";
import "./FormCadHospedes.css";
import FormHospede from "./FormHospedes";
import Alertas from "../../layout/Alertas";

function FormCadHospede({ handleSubmit }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("informacoes");
  const [formData, setFormData] = useState({
    nome_hospede: "",
    cpf: "",
    rg: "",
    data_nascimento: "",
    sexo: "",
    profissao: "",
    observacoes: "",
    rua: "",
    numero: "",
    cidade: "",
    estado: "",
    cep: "",
    bairro: "",
    complemento: "",
    observacoes_endereco: "",
    email: "",
    celular: "",
  });

  const [alertProps, setAlertProps] = useState({
    show: false,
    message: "",
    variant: "danger",
  });

  const showAlert = (message, variant) => {
    setAlertProps({ show: true, message, variant });
    setTimeout(() => setAlertProps((prev) => ({ ...prev, show: false })), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Verifica se o campo alterado é o CEP e chama a função de busca de endereço
    if (name === "cep" && value.length === 8) {
      console.log("chamou",value)
      handleBuscarCep(value);
      
    }
  };

  // Função para buscar o endereço pelo CEP
  const handleBuscarCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData((prevData) => ({
          ...prevData,
          estado: data.uf || "",
          cidade: data.localidade || "",
          bairro: data.bairro || "",
          rua: data.logradouro || "",
          complemento: data.complemento || "",
        }));
      } else {
        console.error("CEP inválido");
      }
    } catch (error) {
      console.error("Erro ao consultar o CEP:", error);
    }
  };

  const submit = (e) => {
  e.preventDefault();

  // Validação dos campos obrigatórios antes de continuar para a próxima aba
  if (activeTab === "informacoes") {
    if (!formData.nome_hospede || formData.nome_hospede.trim() === "") {
      showAlert("O campo Nome Completo é obrigatório.", "danger");
      return false;
    }

    if (!formData.cpf || formData.cpf.trim() === "") {
      showAlert("O campo CPF é obrigatório e deve ser válido.", "danger");
      return false;
    }

    if (!formData.rg || formData.rg.trim() === "") {
      showAlert("O campo RG é obrigatório.", "danger");
      return false;
    }

    if (!formData.data_nascimento) {
      showAlert("O campo Data de Nascimento é obrigatório.", "danger");
      return false;
    }

    if (!formData.sexo) {
      showAlert("O campo Sexo é obrigatório.", "danger");
      return false;
    }

    if (!formData.profissao || formData.profissao.trim() === "") {
      showAlert("O campo Profissão é obrigatório.", "danger");
      return false;
    }

    // Se todos os campos obrigatórios da aba "Informações" estiverem preenchidos, vai para a aba "Endereço"
    setActiveTab("endereco");
  } else if (activeTab === "endereco") {
    // Validação dos campos obrigatórios da aba "Endereço"
    if (!formData.cep || formData.cep.trim() === "") {
      showAlert("O campo CEP é obrigatório.", "danger");
      return false;
    }

    if (!formData.estado || formData.estado.trim() === "") {
      showAlert("O campo Estado é obrigatório.", "danger");
      return false;
    }

    if (!formData.cidade || formData.cidade.trim() === "") {
      showAlert("O campo Cidade é obrigatório.", "danger");
      return false;
    }

    if (!formData.bairro || formData.bairro.trim() === "") {
      showAlert("O campo Bairro é obrigatório.", "danger");
      return false;
    }

    if (!formData.rua || formData.rua.trim() === "") {
      showAlert("O campo Logradouro é obrigatório.", "danger");
      return false;
    }

    if (!formData.numero || formData.numero.trim() === "") {
      showAlert("O campo Número é obrigatório.", "danger");
      return false;
    }

    // Se todos os campos obrigatórios da aba "Endereço" estiverem preenchidos, vai para a aba "Adicionais"
    setActiveTab("adicionais");
  } else if (activeTab === "adicionais") {
    // Validação dos campos obrigatórios da aba "Adicionais"
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showAlert("O campo E-mail é obrigatório e deve ser válido.", "danger");
      return false;
    }


    // Se todos os campos estiverem preenchidos corretamente, chama a função de envio e navega para a próxima página
    handleSubmit(formData);
    txtHospede(formData);
    navigate("/tabela_hospedes");
  }
};


  const handleCancel = () => {
    navigate("/tabela_hospedes");
  };

  return (
    <div className="container mt-4">
      <Alertas
        show={alertProps.show}
        variant={alertProps.variant}
        message={alertProps.message}
        onClose={() => setAlertProps((prev) => ({ ...prev, show: false }))}
      />
      <h2 style={{ marginLeft: "50px" }}>Novo Hóspede</h2>
      <Tab.Container
        id="left-tabs-example"
        activeKey={activeTab}
        onSelect={setActiveTab}
      >
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="informacoes" className="p-1 fs-6">
              Informações do Hóspede
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="endereco" className="p-1 fs-6">
              Endereço
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="adicionais" className="p-1 fs-6">
              Adicionais
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <FormHospede setFormData={setFormData} formData={formData} handleChange={handleChange} />
        </Tab.Content>
      </Tab.Container>

      <div className="text-center mt-4">
        <Button variant="danger" className="mt-2 me-2" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          className="mt-2"
          type="submit"
          onClick={submit}
        >
          {activeTab === "adicionais" ? "Salvar" : "Continuar"}
        </Button>
      </div>
    </div>
  );
}

export default FormCadHospede;