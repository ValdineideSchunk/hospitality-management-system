import { useState } from "react";
import { Form, Tab } from "react-bootstrap";
import Alertas from "../../layout/Alertas";
import { validarCPF, validarFormatoCEP, validarCEPAPI, verificarCPFBancoDados } from "../../../utils/validacoes";

function FormHospede({ setFormData, formData, handleChange, submit }) {
  const formGroupStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  };

  const labelStyle = {
    width: "160px",
    textAlign: "right",
    marginRight: "0.5rem",
  };

  const [alertProps, setAlertProps] = useState({
    show: false,
    message: "",
    variant: "danger",
  });

  const showAlert = (message, variant) => {
    setAlertProps({ show: true, message, variant });
    setTimeout(() => setAlertProps((prev) => ({ ...prev, show: false })), 5000);
  };

  const inputStyle = { width: "400px" };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Valida CPF antes de enviar
    if (formData.cpf && !validarCPF(formData.cpf)) {
      showAlert("O CPF informado é inválido. Corrija antes de prosseguir.", "danger");
      return;
    }

    // Valida CEP antes de enviar
    if (formData.cep && !validarFormatoCEP(formData.cep)) {
      showAlert("O CEP deve conter 8 dígitos. Corrija antes de prosseguir.", "danger");
      return;
    }
    
    // Chama a função submit original
    submit(e);
  };

  return (
    <>
      <Alertas
        show={alertProps.show}
        variant={alertProps.variant}
        message={alertProps.message}
        onClose={() => setAlertProps((prev) => ({ ...prev, show: false }))}
      />
      <Tab.Pane eventKey="informacoes">
        <Form
          onSubmit={handleSubmit}
          className="border rounded pt-3"
          style={{ textAlign: "left" }}
        >
          <div className="mx-auto">
            {/* Nome Completo */}
            <div style={formGroupStyle}>
              <Form.Label htmlFor="formNome" style={labelStyle}>
                Nome Completo:
              </Form.Label>
              <Form.Control
                type="text"
                id="formNome"
                name="nome_hospede"
                value={formData.nome_hospede}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-ZáéíóúÁÉÍÓÚãõâêîôûçÇ\s'-]*$/.test(value)) {
                    handleChange(e);
                  } else {
                    showAlert(
                      "O campo Nome Completo deve conter apenas letras",
                      "danger"
                    );
                  }
                }}
                placeholder="Digite seu nome completo"
                maxLength={255}
                required
                autoComplete="name"
                style={inputStyle}
              />
            </div>

            {/* CPF */}
            <div style={formGroupStyle}>
              <Form.Label htmlFor="formCpf" style={labelStyle}>
                CPF:
              </Form.Label>
              <Form.Control
                type="text"
                id="formCpf"
                name="cpf"
                value={formData.cpf}
                onChange={async (e) => {
                  const value = e.target.value;

                  // Permite apenas números
                  if (/^\d*$/.test(value)) {
                    // Atualiza o valor do CPF no estado
                    handleChange(e);

                    // Valida o CPF se o valor tiver 11 dígitos
                    if (value.length === 11) {
                      if (!validarCPF(value)) {
                        showAlert("O CPF informado é inválido.", "danger");
                      } else {
                        // Se o CPF é válido, verifica se já está cadastrado
                        const resultado = await verificarCPFBancoDados(value);
                        if (resultado.existe) {
                          showAlert(resultado.mensagem, "warning");
                        } else if (resultado.erro) {
                          showAlert(resultado.mensagem, "danger");
                        }
                      }
                    }
                  } else {
                    showAlert(
                      "O campo CPF deve conter apenas números",
                      "danger"
                    );
                  }
                }}
                placeholder="Digite seu CPF"
                maxLength={11}
                required
                style={{ width: "200px" }}
              />
            </div>

            {/* RG */}
            <div style={formGroupStyle}>
              <Form.Label htmlFor="formRg" style={labelStyle}>
                RG:
              </Form.Label>
              <Form.Control
                type="text"
                id="formRg"
                name="rg"
                value={formData.rg}
                onChange={(e) => {
                  const value = e.target.value;

                  // Permite apenas números
                  if (/^\d*$/.test(value)) {
                    // Atualiza o valor do RG no estado
                    setFormData({ ...formData, rg: value });
                  } else {
                    showAlert(
                      "O campo RG deve conter apenas números",
                      "danger"
                    );
                  }
                }}
                placeholder="Digite seu RG"
                maxLength={20}
                required
                style={{ width: "150px" }}
              />
            </div>

            {/* Data de Nascimento */}
            <div style={formGroupStyle}>
              <Form.Label htmlFor="formDataNascimento" style={labelStyle}>
                Data de Nascimento:
              </Form.Label>
              <Form.Control
                type="date"
                id="formDataNascimento"
                name="data_nascimento"
                value={
                  formData.data_nascimento
                    ? formData.data_nascimento.split("T")[0]
                    : ""
                }
                onChange={handleChange}
                required
                autoComplete="bday"
                style={{ width: "200px" }}
              />
            </div>

            {/* Sexo */}
            <div style={formGroupStyle}>
              <Form.Label htmlFor="formSexo" style={labelStyle}>
                Sexo:
              </Form.Label>
              <Form.Control
                as="select"
                id="formSexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                required
                style={{ width: "160px" }}
              >
                <option value="">Por favor selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </Form.Control>
            </div>

            {/* Profissão */}
            <div style={formGroupStyle}>
              <Form.Label htmlFor="formProfissao" style={labelStyle}>
                Profissão:
              </Form.Label>
              <Form.Control
                type="text"
                id="formProfissao"
                name="profissao"
                value={formData.profissao}
                onChange={handleChange}
                placeholder="Digite seu profissão"
                maxLength={255}
                required
                style={inputStyle}
              />
            </div>

            {/* Observações */}
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formObservacoes"
                style={{ width: "160px" }}
              >
                Observações:
              </Form.Label>
              <Form.Control
                as="textarea"
                id="formObservacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Observaões..."
                maxLength={255}
                style={{ width: "400px" }}
              />
            </div>
          </div>
        </Form>
      </Tab.Pane>

      <Tab.Pane eventKey="endereco">
        <Form onSubmit={submit} className="border rounded p-3">
          <div className="mx-auto">
            {/* Endereço - CEP */}
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formCep"
                style={{ width: "160px" }}
              >
                CEP:
              </Form.Label>
              <Form.Control
                type="text"
                id="formCep"
                name="cep"
                value={formData.cep}
                onChange={(e) => {
                  const value = e.target.value;

                  // Permite apenas números
                  if (/^\d*$/.test(value)) {
                    // Atualiza o valor do CEP - handleChange vai chamar handleBuscarCep
                    handleChange(e);
                  } else {
                    showAlert(
                      "O campo CEP deve conter apenas números",
                      "danger"
                    );
                  }
                }}
                placeholder="Digite seu CEP (8 dígitos)"
                maxLength={8}
                required
                autoComplete="postal-code"
                style={{ width: "220px" }}
              />
            </div>

            {/* Endereço - Estado */}
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formEstado"
                style={{ width: "160px" }}
              >
                Estado:
              </Form.Label>
              <Form.Control
                type="text"
                id="formEstado"
                name="estado"
                value={formData.estado}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-ZáéíóúÁÉÍÓÚãõâêîôûçÇ\s'-]*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                placeholder="Estados"
                maxLength={255}
                required
                style={{ width: "250px" }}
              />
            </div>

            {/* Endereço - Cidade */}
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formCidade"
                style={{ width: "160px" }}
              >
                Cidade:
              </Form.Label>
              <Form.Control
                type="text"
                id="formCidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Cidade"
                maxLength={255}
                required
                style={{ width: "250px" }}
              />
            </div>

            {/* Endereço - Bairro */}
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formBairro"
                style={{ width: "160px" }}
              >
                Bairro:
              </Form.Label>
              <Form.Control
                type="text"
                id="formBairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="Bairro"
                maxLength={255}
                required
                style={{ width: "250px" }}
              />
            </div>

            {/* Endereço - Rua */}
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formRua"
                style={{ width: "160px" }}
              >
                Logradouro:
              </Form.Label>
              <Form.Control
                type="text"
                id="formRua"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
                placeholder="Rua"
                maxLength={255}
                required
                autoComplete="address-line1"
                style={{ width: "350px" }}
              />
            </div>

            {/* Endereço - Número */}
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formNumero"
                style={{ width: "160px" }}
              >
                Número:
              </Form.Label>
              <Form.Control
                type="text"
                id="formNumero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Número"
                maxLength={255}
                required
                style={{ width: "100px" }}
              />
            </div>

            {/* Endereço - Complemento */}
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formComplemento"
                style={{ width: "160px" }}
              >
                Complemento:
              </Form.Label>
              <Form.Control
                type="text"
                id="formComplemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                placeholder="Complemento"
                maxLength={255}
                style={{ width: "350px" }}
              />
            </div>

            {/* Endereço - Observações */}
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formObservacoes_endereco"
                style={{ width: "160px" }}
              >
                Observações:
              </Form.Label>
              <Form.Control
                as="textarea"
                id="formObservacoes_endereco"
                name="observacoes_endereco"
                value={formData.observacoes_endereco}
                onChange={handleChange}
                placeholder="Observações..."
                maxLength={255}
                style={{ width: "350px" }}
              />
            </div>
          </div>
        </Form>
      </Tab.Pane>

      <Tab.Pane eventKey="adicionais">
        <Form onSubmit={submit} className="border rounded p-3">
          <div className="mx-auto">
            {/* Email */}
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formEmail"
                style={{ width: "160px" }}
              >
                E-mail:
              </Form.Label>
              <Form.Control
                type="email"
                id="formEmail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu Email"
                maxLength={255}
                required
                autoComplete="email"
                style={{ width: "400px" }}
              />
            </div>

            {/* celular */}
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formCelular"
                style={{ width: "160px" }}
              >
                Número do Celular:
              </Form.Label>
              <Form.Control
                type="tel"
                id="formCelular"
                name="celular"
                value={formData.celular}
                onChange={(e) => {
                  const value = e.target.value;

                  // Permite apenas números
                  if (/^\d*$/.test(value)) {
                    // Atualiza o valor do Celular no estado
                    setFormData({ ...formData, celular: value });
                  } else {
                    showAlert(
                      "O campo Número do Celular deve conter apenas números",
                      "danger"
                    );
                  }
                }}
                placeholder="Digite seu número de celular"
                maxLength={255}
                required
                autoComplete="tel"
                style={{ width: "200px" }}
              />
            </div>
          </div>
        </Form>
      </Tab.Pane>
    </>
  );
}

export default FormHospede;