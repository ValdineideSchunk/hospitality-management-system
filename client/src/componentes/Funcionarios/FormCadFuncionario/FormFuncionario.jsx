import React from "react";
import { Form, Tab } from "react-bootstrap";

function FormFuncionario({ formData, handleChange, submit }) {

  return (
    <>
      <Tab.Pane eventKey="informacoes">
        <Form
          onSubmit={submit}
          className="border rounded pt-3"
          style={{ textAlign: "left" }}
        >
          <div className="mx-auto">
            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formNome"
                style={{ width: "160px" }}
              >
                Nome Completo:
              </Form.Label>
              <Form.Control
                type="text"
                id="formNome"
                name="nome_funcionario"
                value={formData.nome_funcionario}
                onChange={handleChange}
                required
                style={{ width: "400px" }}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formCpf"
                style={{ width: "160px" }}
              >
                CPF:
              </Form.Label>
              <Form.Control
                type="text"
                id="formCpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
                style={{ width: "200px" }}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formRg"
                style={{ width: "160px" }}
              >
                RG:
              </Form.Label>
              <Form.Control
                type="text"
                id="formRg"
                name="rg"
                value={formData.rg}
                onChange={handleChange}
                required
                style={{ width: "150px" }}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formdata_nascimento"
                style={{ width: "160px" }}
              >
                Data de Nascimento:
              </Form.Label>
              <Form.Control
                type="date"
                id="formdata_nascimento"
                name="data_nascimento"
                value={
                  formData.data_nascimento
                    ? new Date(formData.data_nascimento).toISOString().split("T")[0]
                    : ""
                }
                
                onChange={handleChange}
                required
                style={{ width: "200px" }}
              />
            </div>


            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formSexo"
                style={{ width: "160px" }}
              >
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
                required
                style={{ width: "400px" }}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formTelefone"
                style={{ width: "160px" }}
              >
                Número de Telefone:
              </Form.Label>
              <Form.Control
                type="tel"
                id="formTelefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                style={{ width: "200px" }}
              />
            </div>

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
                style={{ width: "400px" }}
              />
            </div>
          </div>
        </Form>
      </Tab.Pane>

      <Tab.Pane eventKey="endereco">
        <Form onSubmit={submit} className="border rounded p-3">
          <div className="mx-auto">
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
                onChange={handleChange}
                required
                style={{ width: "180px" }}
              />
            </div>

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
                onChange={handleChange}
                required
                style={{ width: "250px" }}
              />
            </div>

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
                required
                style={{ width: "250px" }}
              />
            </div>

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
                name=".bairro"
                value={formData.bairro}
                onChange={handleChange}
                required
                style={{ width: "250px" }}
              />
            </div>

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
                id="formLogradouro"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                required
                style={{ width: "350px" }}
              />
            </div>

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
                required
                style={{ width: "100px" }}
              />
            </div>

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
                style={{ width: "350px" }}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formObservacaoendereco"
                style={{ width: "160px" }}
              >
                Observações:
              </Form.Label>
              <Form.Control
                as="textarea"
                id="formObservacaoEndereco"
                name="observacoes_endereco"
                value={formData.observacoes_endereco}
                onChange={handleChange}
                style={{ width: "350px" }}
              />
            </div>
          </div>
        </Form>
      </Tab.Pane>

          <Tab.Pane eventKey="adicionais">
            <Form onSubmit={submit} className="border rounded p-3">
              <div className="mx-auto">
                <div className="mb-3 d-flex align-items-center">
                  <Form.Label className="me-2 text-end" htmlFor="formCargo" style={{ width: '160px' }}>Cargo:</Form.Label>
                  <Form.Control
                    as="select"
                    id="formCargo"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    required
                    style={{ width: '200px' }} 
                    >
                    <option value="">Por favor selecione</option>
                    <option value="administrador">Administrador</option> 
                    <option value="recepcionista">Recepcionista</option>
                    <option value="camareira">Camareira</option>
                    </Form.Control>
                </div>

            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formDataAdmissao"
                style={{ width: "160px" }}
              >
                Data de Admissão:
              </Form.Label>
              <Form.Control
                type="date"
                id="formDataAdmissao"
                name="data_admissao"
                value={
                  formData.data_admissao
                    ? new Date(formData.data_admissao).toISOString().split("T")[0]
                    : ""
                }
                
                onChange={handleChange}
                required
                style={{ width: "200px" }}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formDataEmissaoCarteira"
                style={{ width: "160px" }}
              >
                Data de Emissão da Carteira:
              </Form.Label>
              <Form.Control
                type="date"
                id="formDataEmissaoCarteira"
                name="data_emissao_carteira"
                value={
                  formData.data_emissao_carteira
                    ? new Date(formData.data_emissao_carteira).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                required
                style={{ width: "200px" }}
              />
            </div>


            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formBanco"
                style={{ width: "160px" }}
              >
                Banco:
              </Form.Label>
              <Form.Control
                type="text"
                id="formBanco"
                name="banco"
                value={formData.banco}
                onChange={handleChange}
                required
                style={{ width: "250px" }}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formAgencia"
                style={{ width: "160px" }}
              >
                Agência:
              </Form.Label>
              <Form.Control
                type="text"
                id="formAgencia"
                name="agencia"
                value={formData.agencia}
                onChange={handleChange}
                required
                style={{ width: "150px" }}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formConta"
                style={{ width: "160px" }}
              >
                Conta:
              </Form.Label>
              <Form.Control
                type="text"
                id="formConta"
                name="conta"
                value={formData.conta}
                onChange={handleChange}
                required
                style={{ width: "150px" }}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formStatus"
                style={{ width: "160px" }}
              >
                Status:
              </Form.Label>
              <Form.Control
                as="select"
                id="formStatus"
                name="status_funcionario"
                value={formData.status_funcionario}
                onChange={handleChange}
                required
                style={{ width: "200px" }}
              >
                <option value="">Por favor selecione</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </Form.Control>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <Form.Label
                className="me-2 text-end"
                htmlFor="formObservacoesadicionais"
                style={{ width: "160px" }}
              >
                Observações:
              </Form.Label>
              <Form.Control
                as="textarea"
                id="formObservacoesadicionais"
                name="observacoesAdicionais"
                value={formData.observacoes_adicionais}
                onChange={handleChange}
                style={{ width: "350px" }}
              />
            </div>
          </div>
        </Form>
      </Tab.Pane>
    </>
  );
}

export default FormFuncionario;
