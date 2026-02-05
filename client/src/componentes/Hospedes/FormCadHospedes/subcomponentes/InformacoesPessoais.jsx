import { Form, Tab } from "react-bootstrap";
import {
  formGroupStyle,
  labelStyle,
  inputStyle,
  inputXSmallStyle,
  inputDateStyle,
  inputSelectStyle,
} from "../styles";
import { validarCPF, verificarCPFBancoDados } from "../../../../utils/validacoes";

function InformacoesPessoais({ formData, setFormData, handleChange, showAlert }) {
  const handleNomeChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚãõâêîôûçÇ\s'-]*$/.test(value)) {
      handleChange(e);
    } else {
      showAlert(
        "O campo Nome Completo deve conter apenas letras",
        "danger"
      );
    }
  };

  const handleCpfChange = async (e) => {
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
  };

  const handleRgChange = (e) => {
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
  };

  return (
    <Tab.Pane eventKey="informacoes">
      <Form className="border rounded pt-3" style={{ textAlign: "left" }}>
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
              onChange={handleNomeChange}
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
              onChange={handleCpfChange}
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
              onChange={handleRgChange}
              placeholder="Digite seu RG"
              maxLength={20}
              required
              style={inputXSmallStyle}
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
              style={inputDateStyle}
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
              style={inputSelectStyle}
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
  );
}

export default InformacoesPessoais;
