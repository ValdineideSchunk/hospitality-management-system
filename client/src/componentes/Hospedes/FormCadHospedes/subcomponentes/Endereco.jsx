import { Form, Tab } from "react-bootstrap";
import {
  labelAddressStyle,
  inputCepStyle,
  inputAddressStyle,
  inputRuaStyle,
  inputNumeroStyle,
  textareaAddressStyle,
} from "../styles";

function Endereco({ formData, handleChange, showAlert }) {
  const handleCepChange = (e) => {
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
  };

  const handleEstadoChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚãõâêîôûçÇ\s'-]*$/.test(value)) {
      handleChange(e);
    }
  };

  return (
    <Tab.Pane eventKey="endereco">
      <Form className="border rounded p-3">
        <div className="mx-auto">
          {/* Endereço - CEP */}
          <div className="mb-3 d-flex align-items-center">
            <Form.Label
              className="me-2 text-end"
              htmlFor="formCep"
              style={labelAddressStyle}
            >
              CEP:
            </Form.Label>
            <Form.Control
              type="text"
              id="formCep"
              name="cep"
              value={formData.cep}
              onChange={handleCepChange}
              placeholder="Digite seu CEP (8 dígitos)"
              maxLength={8}
              required
              autoComplete="postal-code"
              style={inputCepStyle}
            />
          </div>

          {/* Endereço - Estado */}
          <div className="mb-3 d-flex align-items-center">
            <Form.Label
              className="me-2 text-end"
              htmlFor="formEstado"
              style={labelAddressStyle}
            >
              Estado:
            </Form.Label>
            <Form.Control
              type="text"
              id="formEstado"
              name="estado"
              value={formData.estado}
              onChange={handleEstadoChange}
              placeholder="Estados"
              maxLength={255}
              required
              style={inputAddressStyle}
            />
          </div>

          {/* Endereço - Cidade */}
          <div className="mb-3 d-flex align-items-center">
            <Form.Label
              className="me-2 text-end"
              htmlFor="formCidade"
              style={labelAddressStyle}
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
              style={inputAddressStyle}
            />
          </div>

          {/* Endereço - Bairro */}
          <div className="mb-3 d-flex align-items-center">
            <Form.Label
              className="me-2 text-end"
              htmlFor="formBairro"
              style={labelAddressStyle}
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
              style={inputAddressStyle}
            />
          </div>

          {/* Endereço - Rua */}
          <div className="mb-3 d-flex align-items-center">
            <Form.Label
              className="me-2 text-end"
              htmlFor="formRua"
              style={labelAddressStyle}
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
              style={inputRuaStyle}
            />
          </div>

          {/* Endereço - Número */}
          <div className="mb-3 d-flex align-items-center">
            <Form.Label
              className="me-2 text-end"
              htmlFor="formNumero"
              style={labelAddressStyle}
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
              style={inputNumeroStyle}
            />
          </div>

          {/* Endereço - Complemento */}
          <div className="mb-3 d-flex align-items-center">
            <Form.Label
              className="me-2 text-end"
              htmlFor="formComplemento"
              style={labelAddressStyle}
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
              style={inputRuaStyle}
            />
          </div>

          {/* Endereço - Observações */}
          <div className="mb-3 d-flex align-items-center">
            <Form.Label
              className="me-2 text-end"
              htmlFor="formObservacoes_endereco"
              style={labelAddressStyle}
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
              style={textareaAddressStyle}
            />
          </div>
        </div>
      </Form>
    </Tab.Pane>
  );
}

export default Endereco;
