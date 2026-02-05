import { Form, Tab } from "react-bootstrap";
import {
  labelAddressStyle,
  inputStyle,
  inputSmallStyle,
} from "../styles";

function Adicionais({ formData, setFormData, handleChange, showAlert }) {
  const handleCelularChange = (e) => {
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
  };

  return (
    <Tab.Pane eventKey="adicionais">
      <Form className="border rounded p-3">
        <div className="mx-auto">
          {/* Email */}
          <div className="mb-3 d-flex align-items-center">
            <Form.Label
              className="me-2 text-end"
              htmlFor="formEmail"
              style={labelAddressStyle}
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
              style={inputStyle}
            />
          </div>

          {/* celular */}
          <div className="mb-3 d-flex align-items-center">
            <Form.Label
              className="me-2 text-end"
              htmlFor="formCelular"
              style={labelAddressStyle}
            >
              Número do Celular:
            </Form.Label>
            <Form.Control
              type="tel"
              id="formCelular"
              name="celular"
              value={formData.celular}
              onChange={handleCelularChange}
              placeholder="Digite seu número de celular"
              maxLength={255}
              required
              autoComplete="tel"
              style={inputSmallStyle}
            />
          </div>
        </div>
      </Form>
    </Tab.Pane>
  );
}

export default Adicionais;
