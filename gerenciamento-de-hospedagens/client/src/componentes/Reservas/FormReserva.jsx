import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TabelaHospede from '../Hospedes/TabelaHospedes/TabelaHospedes';
import ListagemAcomodacoes from '../acomodacao/ListaAcomodacoes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Alertas from '../layout/Alertas';


function FormReserva({ formData, setFormData, handleChange, dataInicio, dataFim, isEditing, nomeHospede, nomeAcomodacao }) {
  const [mostrarTabelaHospedes, setMostrarTabelaHospedes] = useState(false);
  const [mostrarTabelaAcomodacoes, setMostrarTabelaAcomodacoes] = useState(false);
  const InfAcomodacao = () => setMostrarTabelaAcomodacoes(true);
  const [nomeHospedeExibido, setNomeHospedeExibido] = useState(nomeHospede || "");
  const [nomeAcomodacaoExibida, setNomeAcomodacaoExibida] = useState(nomeAcomodacao || "");
  const [capacidade, setCapacidade] = useState("");
  const [diarias, setDiarias] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);


  const refs = useRef({
    data_checkin: null,
    data_checkout: null,
  });

  // Estado para configurar as mensagens de alerta
  const [alertProps, setAlertProps] = useState({
    show: false,
    message: "",
    variant: "danger",
  });

  // Função para exibir alertas com mensagem e estilo
  const showAlert = (message, variant) => {
    setAlertProps({ show: true, message, variant });
    // Oculta o alerta automaticamente após 5 segundos
    setTimeout(() => setAlertProps((prev) => ({ ...prev, show: false })), 5000);
  };

  // Verifica se o status é "finalizada" ou "cancelada"
  const isNonEditable = isEditing && ['finalizada', 'cancelada'].includes(formData.status_reserva);

  // Atualiza o estado `nomeHospedeExibido` quando `nomeHospede` mudar
  useEffect(() => {
    if (nomeHospede) {
      setNomeHospedeExibido(nomeHospede);
    }
  }, [nomeHospede]);

  // Atualiza o estado `nomeAcomodacaoExibida` quando `nomeHospede` mudar
  useEffect(() => {
    if (nomeAcomodacao) {
      setNomeAcomodacaoExibida(nomeAcomodacao);
    }
  }, [nomeAcomodacao]);

  const handleSelectHospede = (fk_hospede) => {
    // Define o id do hospede como o valor que será enviado para o banco
    handleChange({ target: { name: 'fk_hospede', value: fk_hospede.id_hospede } });
    // Exibe o nome do hospede para o usuário enquanto guarda o ID
    setNomeHospedeExibido(fk_hospede.nome_hospede);
    setMostrarTabelaHospedes(false);
    setFormData((prev) => ({
      ...prev,
      nome_hospede: fk_hospede.nome_hospede
    }))
  };

  const handleSelectAcomodacao = (fk_acomodacao) => {
    console.log("Dados da acomodação selecionada:", fk_acomodacao);
    // Salva a capacidade no estado
    setCapacidade(fk_acomodacao.capacidade);

    // Outras ações
    handleChange({ target: { name: "fk_acomodacao", value: fk_acomodacao.id } });
    setNomeAcomodacaoExibida(fk_acomodacao.nome);
    setMostrarTabelaAcomodacoes(false);
    setFormData((prev) => ({
      ...prev,
      nome: fk_acomodacao.nome
    }))
  };


  // Executa quando capacidade é atualizada
  useEffect(() => {
    if (capacidade !== "") {
      console.log("Capacidade atualizada:", capacidade);
    }
  }, [capacidade]); // Escuta mudanças na variável `capacidade`

  const totalPessoas = parseInt(formData.numero_adulto || 0) + parseInt(formData.numero_crianca || 0);
  useEffect(() => {
    if (capacidade && totalPessoas > capacidade) {
      showAlert(
        "A quantidade de hóspedes informada excede a capacidade máxima da acomodação selecionada.",
        "danger"
      );
      setFormData({
        ...formData,
        numero_adulto: '',
        numero_crianca: '0',
      });
    }

  }, [capacidade, totalPessoas, formData]);

  const isDatasPreenchidas = () => {
    return formData.data_checkin && formData.data_checkout;
  };

  useEffect(() => {
    console.log('Data Início:', dataInicio);
    console.log('Data Fim:', dataFim);
  }, [dataInicio, dataFim]);

  useEffect(() => {
  }, [formData]);


  const handleDateChange = async (e) => {
    const { name, value } = e.target;

    // Atualiza o estado com os dados da data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const dataEntradaExata = formData.data_checkin;
    const dataSaidaExata = formData.data_checkout;

    if (!dataEntradaExata || !dataSaidaExata) {
      return; // Apenas verifica se ambas as datas estão preenchidas
    }

    if (isEditing) {
      try {
        const response = await fetch(
          `http://localhost:5000/acomodacoes/disponibilidade/${dataEntradaExata}/${dataSaidaExata}/${formData.fk_acomodacao}/${formData.id_reserva}`
        );

        if (!response.ok) {
          throw new Error(`Erro ao verificar disponibilidade: ${response.statusText}`);
        }

        const { disponivel } = await response.json();

        if (!disponivel) {
          showAlert(
            "Selecione outra acomodação: a acomodação atual da reserva não está disponível para o período informado.",
            "danger"
          );

          setFormData((prev) => ({
            ...prev,
            fk_acomodacao: "",
            numero_adulto: "",
            numero_crianca: "0",
          }));

          setNomeAcomodacaoExibida("");
        }
      } catch (error) {
        console.error("Erro ao verificar disponibilidade:", error);
        showAlert("Erro ao verificar a disponibilidade da acomodação. Tente novamente.", "danger");
      }
    }
  };

  const handleBlur = () => {
    const observacoesValue = formData.observacoes || '';
    if (!observacoesValue.trim()) {
      setFormData(prevData => ({
        ...prevData,
        observacoes: ' ',
      }));
    }
  };

  useEffect(() => {
    if (formData.data_checkin && formData.data_checkout) {
      const qtdDiarias = calcularDiarias(formData.data_checkin, formData.data_checkout);
      setDiarias(qtdDiarias);
      setFormData((prev) => ({
        ...prev,
        quantidade_diarias: qtdDiarias, // Atualiza o número de diárias no formData
      }));
    } else {
      setDiarias(0);
      setFormData((prev) => ({
        ...prev,
        quantidade_diarias: 0, // Define 0 se as datas forem inválidas
      }));
    }
  }, [formData.data_checkin, formData.data_checkout]);
  


  const calcularDiarias = (dataInicio, dataFim) => {
    const dataInicioObj = new Date(dataInicio);
    const dataFimObj = new Date(dataFim);

    if (dataFimObj >= dataInicioObj) {
      const diffTime = Math.abs(dataFimObj - dataInicioObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays; // Retorna o número de diárias
    }

    return 0; // Retorna 0 se as datas forem inválidas
  };

  const calcularValorTotal = (valorDiaria, diarias) => {
    return valorDiaria && diarias ? valorDiaria * diarias : 0;
  };

  useEffect(() => {
    if (formData.valor_diaria && diarias) {
      const total = calcularValorTotal(parseFloat(formData.valor_diaria), diarias);
      setValorTotal(total);
      setFormData((prev) => ({
        ...prev,
        valor_total: total.toFixed(2), // Atualiza o valor total no formData
      }));
    } else {
      setValorTotal(0);
      setFormData((prev) => ({
        ...prev,
        valor_total: "0.00", // Define 0.00 se o valor da diária ou diárias forem inválidos
      }));
    }
  }, [formData.valor_diaria, diarias]);
  



  return (
    <div className="border rounded pt-3" style={{ textAlign: "left" }}>
      <h4 style={{ marginLeft: '40px', position: 'relative', zIndex: 1 }}>Informações da Reserva</h4>
      <Alertas
        show={alertProps.show}
        variant={alertProps.variant}
        message={alertProps.message}
        onClose={() => setAlertProps((prev) => ({ ...prev, show: false }))}
      />
      <div className="mx-auto">
        {/* Campo Situação */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "160px" }}>Situação:</label>
          <div className="d-flex">
            {isNonEditable ? (
              <div className="me-2">
                <input
                  type="radio"
                  id="status_atual"
                  name="status_reserva"
                  value={formData.status_reserva}
                  checked
                  readOnly
                />
                <label htmlFor="status_atual" className="ms-1 text-capitalize">
                  {formData.status_reserva} {/* Exibe "cancelada" ou "finalizada" */}
                </label>
              </div>
            ) : (
              <>
                <div className="me-2">
                  <input
                    type="radio"
                    id="reservar"
                    name="status_reserva"
                    value="reservado"
                    checked={formData.status_reserva === 'reservado'}
                    onChange={handleChange}
                  />
                  <label htmlFor="reservar" className="ms-1">
                    {isEditing ? "Reservado" : "Reservar"}
                  </label>
                </div>
                <div className="me-2">
                  <input
                    type="radio"
                    id="hospedar"
                    name="status_reserva"
                    value="hospedado"
                    checked={formData.status_reserva === 'hospedado'}
                    onChange={handleChange}
                  />
                  <label htmlFor="hospedar" className="ms-1">
                    {isEditing ? "Hospedado" : "Hospedar"}
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Campo Hóspede */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "160px" }}>Hóspede:</label>
          <div className="d-flex align-items-center" style={{ width: "400px" }}>
            <input
              type="text"
              name="fk_hospede"
              className="form-control"
              value={nomeHospedeExibido}
              readOnly
              style={{ pointerEvents: 'none' }}
              disabled={isNonEditable}
            />
            <button
              type="button"
              className="btn btn-primary ms-2"
              onClick={() => setMostrarTabelaHospedes(true)} // Ajuste no método de abertura
              disabled={isNonEditable}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        {/* Renderização condicional da tabela em overlay */}
        {mostrarTabelaHospedes && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
            style={{ zIndex: 400 }}
          >
            <div className="bg-white p-4 rounded shadow-sm w-75 h-75 overflow-auto position-relative">
              <button
                type="button"
                className="btn btn-danger position-absolute top-0 end-0 me-3 mt-3"
                onClick={() => setMostrarTabelaHospedes(false)} // Fecha a tabela
              >
                Fechar
              </button>
              <TabelaHospede
                exibirAcoes={true}
                textoBotao="Selecionar"
                onSelectHospede={handleSelectHospede} // Certifique-se de passar esta função
              />
            </div>
          </div>
        )}

        {/* Campo Data de Entrada */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "160px" }}>Data de Entrada:</label>
          <input
            type="date"
            className="form-control"
            name="data_checkin"
            value={formData.data_checkin ? formData.data_checkin.split('T')[0] : ''}
            onChange={handleDateChange}
            style={{ width: "200px" }}
            min={!isEditing ? new Date().toLocaleDateString('en-CA') : undefined} // Remove a restrição ao editar
            disabled={isNonEditable}
          />
        </div>

        {/* Campo Data de Saída */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "160px" }}>Data de Saída:</label>
          <input
            type="date"
            className="form-control"
            name="data_checkout"
            value={formData.data_checkout ? formData.data_checkout.split('T')[0] : ''}
            onChange={handleDateChange}
            style={{ width: "200px" }}
            disabled={isNonEditable}
          />
        </div>

        {/* Campo Acomodação */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "160px" }}>Acomodação:</label>
          <div className="d-flex align-items-center" style={{ width: "400px" }}>
            <input
              type="text"
              name="fk_acomodacao"
              className="form-control"
              value={nomeAcomodacaoExibida || "Selecione uma acomodação ->"}
              readOnly
              style={{ pointerEvents: 'none' }}
              disabled={isNonEditable}
            />
            <button
              type="button"
              className="btn btn-primary ms-2"
              onClick={() => {
                if (isDatasPreenchidas()) {
                  InfAcomodacao();
                } else {
                  showAlert(
                    "Por favor, informe as datas de entrada e saída antes de selecionar uma acomodação.",
                    "danger"
                  );
                }
              }}
              disabled={isNonEditable}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
        {mostrarTabelaAcomodacoes && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
            style={{ zIndex: 400 }}
          >
            <div className="bg-white p-4 rounded shadow-sm w-75 h-75 overflow-auto position-relative">
              <ListagemAcomodacoes
                textoBotao="Selecionar"
                onSelectAcomodacao={handleSelectAcomodacao}
                dataInicio={dataInicio}
                dataFim={dataFim}
              />
              {/* Botão de Fechar posicionado no canto superior direito e cor vermelha */}
              <button
                type="button"
                className="btn btn-danger position-absolute top-0 end-0 me-3 mt-3"
                onClick={() => setMostrarTabelaAcomodacoes(false)} // Fecha a tabela
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Campo Número de Adultos */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "160px" }}>Nº de Adultos:</label>
          <input
            type="text"
            className="form-control"
            name="numero_adulto"
            value={formData.numero_adulto || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleChange(e);
              }
            }}
            onFocus={() => {
              if (!nomeAcomodacaoExibida) {
                showAlert(
                  "Por favor, selecione uma acomodação antes de preencher este campo.",
                  "danger"
                );
                document.activeElement.blur();
              }
            }}
            disabled={isNonEditable} // Desabilita o campo quando isNonEditable é true
            min="1"
            max="100"
            style={{ width: "200px" }}
          />
        </div>

        {/* Campo Número de Crianças */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "160px" }}>Nº de Crianças:</label>
          <input
            type="text"
            className="form-control"
            name="numero_crianca"
            value={formData.numero_crianca}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleChange(e);
              }
            }}
            onFocus={() => {
              if (!nomeAcomodacaoExibida) {
                showAlert(
                  "Por favor, selecione uma acomodação antes de preencher este campo.",
                  "danger"
                );
                document.activeElement.blur();
              }
            }}
            disabled={isNonEditable} // Desabilita o campo quando isNonEditable é true
            min="0"
            max="100"
            style={{ width: "200px" }}
          />
        </div>
        {/* Campo para exibir a quantidade de diárias */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "161px" }}>Quantidade de Diárias:</label>
          <input
            type="text"
            className="form-control"
            value={diarias}
            readOnly
            style={{ width: "200px", pointerEvents: "none" }}
          />
        </div>

        {/* Campo Valor da Diária */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "160px" }}>Valor da Diária:</label>
          <input
            type="text"
            className="form-control"
            name="valor_diaria"
            value={formData.valor_diaria || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*(\.|,)?\d*$/.test(value)) {
                setFormData({
                  ...formData,
                  valor_diaria: value.replace(",", "."),
                });
              }
            }}
            disabled={isNonEditable} // Desabilita o campo quando isNonEditable é true
            style={{ width: "200px" }}
            maxLength="12"
            inputMode="decimal"
          />
        </div>

        {/* Campo para exibir o valor total */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "160px" }}>Valor Total:</label>
          <input
            type="text"
            className="form-control"
            value={valorTotal.toFixed(2)} // Exibe o valor com 2 casas decimais
            readOnly
            style={{ width: "200px", pointerEvents: "none" }}
          />
        </div>


        {/* Campo Pago */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "160px" }}>Pago:</label>
          <div className="d-flex">
            <div className="me-2">
              <input
                type="radio"
                id="pago_sim"
                name="pago"
                value="sim"
                checked={formData.pago === 'sim'}
                onChange={handleChange}
                disabled={isNonEditable} // Desabilita os botões de rádio quando isNonEditable é true
              />
              <label htmlFor="pago_sim" className="ms-1">Sim</label>
            </div>
            <div className="me-2">
              <input
                type="radio"
                id="pago_nao"
                name="pago"
                value="não"
                checked={formData.pago === 'não'}
                onChange={handleChange}
                disabled={isNonEditable} // Desabilita os botões de rádio quando isNonEditable é true
              />
              <label htmlFor="pago_nao" className="ms-1">Não</label>
            </div>
          </div>
        </div>

        {/* Campo Observações */}
        <div className="mb-3 d-flex align-items-center">
          <label className="me-2 text-end" style={{ width: "160px" }}>Observações:</label>
          <textarea
            className="form-control"
            name="observacoes"
            value={formData.observacoes || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isNonEditable} // Desabilita o campo quando isNonEditable é true
            style={{ width: "400px" }}
            maxLength="200"
          ></textarea>
        </div>


      </div>
    </div>
  );
}

export default FormReserva;
