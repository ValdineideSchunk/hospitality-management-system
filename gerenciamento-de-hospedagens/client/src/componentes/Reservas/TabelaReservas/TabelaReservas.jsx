import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Alertas from '../../layout/Alertas';

function TabelaReservas() {
  const [reservas, setReservas] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [showPaymentWarning, setShowPaymentWarning] = useState(false); // Modal de aviso para pagamento
  const location = useLocation();
  const navigate = useNavigate();

  const [alertProps, setAlertProps] = useState({
    show: false,
    message: "",
    variant: "danger",
  });

  const showAlert = (message, variant) => {
    setAlertProps({ show: true, message, variant });
    setTimeout(() => setAlertProps((prev) => ({ ...prev, show: false })), 5000);
  };

  useEffect(() => {
    const alertData = location.state?.alert;
    if (alertData) {
      showAlert(alertData.message, alertData.type);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    setTimeout(() => {
      carregarReservas();
    }, 300);
  }, []);

  async function carregarReservas() {
    try {
      const resposta = await fetch('http://localhost:5000/reservas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!resposta.ok) {
        throw new Error('Erro ao buscar Reservas');
      }
      const consulta = await resposta.json();
      setReservas(consulta);
      setRemoveLoading(true);
    } catch (error) {
      console.log('Erro ao buscar Reservas', error);
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusAction = async (id, novoStatus) => {
    try {
      const resposta = await fetch(`http://localhost:5000/reservas/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ novoStatus }),
      });

      if (!resposta.ok) {
        throw new Error(`Erro ao atualizar status da reserva ${id}`);
      }

      carregarReservas();
      setSelectedReserva(null);
    } catch (error) {
      console.error(`Erro ao atualizar status da reserva ${id}:`, error);
    }
  };

  const filteredReservas = reservas.filter((reserva) => {
    const matchesSearch =
      (reserva.id_reserva && reserva.id_reserva.toString().includes(searchTerm)) ||
      (reserva.cpf && reserva.cpf.includes(searchTerm));
    const matchesStatus = !statusFilter || reserva.status_reserva === statusFilter;
    const isNotBlockedOrUnlocked =
      reserva.status_reserva !== "bloqueado" && reserva.status_reserva !== "desbloqueada";
    return matchesSearch && matchesStatus && isNotBlockedOrUnlocked;
  });

  function formatDateToDash(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const openConfirmationModal = (action, reserva) => {
    setConfirmAction(() => action);
    setSelectedReserva(reserva);
    setShowConfirmation(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
    setShowConfirmation(false);
  };

  return (
    <div className="container-fluid border rounded p-3 shadow-lg"
      style={{
        height: "94vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div className="container py- w-100"
        style={{
          maxWidth: "100%",
          padding: "0",
        }}
      >
        <Alertas
          show={alertProps.show}
          variant={alertProps.variant}
          message={alertProps.message}
          onClose={() => setAlertProps((prev) => ({ ...prev, show: false }))}
        />
        <h2 className="text-center">Lista de Reservas</h2>
        <div className="d-flex mb-3 justify-content-center">
          <input
            type="text"
            placeholder="Pesquisar Reserva pelo Número da Reserva ou CPF do Hóspede"
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control me-2 w-50"
          />
          <Link to="/cadastro_reserva">
            <button className="btn btn-primary">Nova Reserva</button>
          </Link>
        </div>
        <div className="d-flex align-items-center mb-3 justify-content-center">
          <span className="me-3">Filtre Reservas por seus Status: </span>
          <div className="d-flex gap-2">
            <button className="btn btn-secondary" onClick={() => setStatusFilter('')}>Todas</button>
            <button className="btn btn-info" onClick={() => setStatusFilter('reservado')}>Reservado</button>
            <button className="btn btn-primary" onClick={() => setStatusFilter('hospedado')}>Hospedado</button>
            <button className="btn btn-warning" onClick={() => setStatusFilter('cancelada')}>Cancelada</button>
            <button className="btn btn-success" onClick={() => setStatusFilter('finalizada')}>Finalizada</button>
          </div>
        </div>

        <div
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            width: "100%",
          }}
        >
          <table
            className="table table-bordered table-hover mx-auto"
            style={{
              width: "95%",
              tableLayout: "fixed",
            }}
          >
            <thead className="table-primary">
              <tr>
                <th>Número da Reserva</th>
                <th>Hóspede</th>
                <th>CPF</th>
                <th>Acomodação</th>
                <th>Data Entrada</th>
                <th>Data Saída</th>
                <th>Pago</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservas.map((reserva) => (
                <tr
                  key={reserva.id_reserva}
                  onClick={() => setSelectedReserva(reserva)}
                  className={selectedReserva?.id_reserva === "table-primary" ? "table-primary" : ""}
                  style={{ cursor: "pointer" }}
                >
                  <td>{reserva.id_reserva}</td>
                  <td>{reserva.nome_hospede || "Nome não informado"}</td>
                  <td>{reserva.cpf}</td>
                  <td>{reserva.nome_acomodacao || "Acomodação não informada"}</td>
                  <td>{formatDateToDash(reserva.data_checkin)}</td>
                  <td>{formatDateToDash(reserva.data_checkout)}</td>
                  <td>{reserva.pago === "sim" ? "Sim" : "Não"}</td>
                  <td>{reserva.status_reserva}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedReserva && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
            style={{ zIndex: 1050 }}
            onClick={(e) => e.stopPropagation()} 
          >
            <div
              className="bg-light border rounded shadow-lg p-5 w-25 position-relative"
            >
              <button
                type="button"
                className="btn btn-danger position-absolute top-0 end-0 m-2"
                aria-label="Fechar"
                onClick={() => setSelectedReserva(null)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h4 className="text-center mb-4">Opções para a Reserva #{selectedReserva.id_reserva}</h4>
              <p><strong>Hóspede:</strong> {selectedReserva.nome_hospede}</p>
              <p><strong>Data Entrada:</strong> {formatDateToDash(selectedReserva.data_checkin)}</p>
              <p><strong>Data Saída:</strong> {formatDateToDash(selectedReserva.data_checkout)}</p>
              <p><strong>Status:</strong> {selectedReserva.status_reserva}</p>
              <p><strong>Pago:</strong> {selectedReserva.pago === "sim" ? "Sim" : "Não"}</p>
              <div className="d-flex flex-column align-items-center gap-2 mt-3 w-100">
                <Link
                  className="btn btn-primary w-100"
                  to={`/cadastro_reserva/${selectedReserva.id_reserva}`}
                >
                  {selectedReserva.status_reserva === 'cancelada' || selectedReserva.status_reserva === 'finalizada'
                    ? 'Visualizar Reserva'
                    : 'Editar'}
                </Link>
                {selectedReserva.status_reserva === 'reservado' && (
                  <>
                    <button
                      className="btn btn-warning w-100"
                      onClick={() => openConfirmationModal(() => handleStatusAction(selectedReserva.id_reserva, 'cancelada'), selectedReserva)}
                    >
                      Cancelar Reserva
                    </button>
                    <button
                      className="btn btn-info w-100"
                      onClick={() => openConfirmationModal(() => handleStatusAction(selectedReserva.id_reserva, 'hospedado'), selectedReserva)}
                    >
                      Hospedar
                    </button>
                  </>
                )}
                {selectedReserva.status_reserva === 'hospedado' && (
                  <button
                    className="btn btn-success w-100"
                    onClick={() => {
                      if (selectedReserva.pago !== "sim") {
                        setShowPaymentWarning(true); // Exibe o modal de aviso de pagamento
                        return;
                      }
                      openConfirmationModal(() => handleStatusAction(selectedReserva.id_reserva, 'finalizada'), selectedReserva);
                    }}
                  >
                    Finalizar Reserva
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {showPaymentWarning && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
            style={{ zIndex: 1060 }}
          >
            <div className="bg-light border rounded shadow-lg p-4" style={{ width: "50%" }}>
              <h5 className="text-center mb-3">Ação Bloqueada</h5>
              <p className="text-center">
                O pagamento ainda não foi efetuado. Por favor, confirme o pagamento antes de finalizar a reserva.
              </p>
              <div className="text-center">
                <button
                  className="btn btn-danger"
                  onClick={() => setShowPaymentWarning(false)} // Fecha o modal
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
        {showConfirmation && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
            style={{ zIndex: 1060 }}
            onClick={(e) => e.stopPropagation()} // Bloqueia cliques externos
          >
            <div className="bg-light border rounded shadow-lg p-4" style={{ width: "50%" }}>
              <h5 className="text-center mb-3">
                Deseja realmente {confirmAction?.toString().includes('hospedado') ? 'hospedar' : selectedReserva?.status_reserva === 'reservado' ? 'cancelar' : 'finalizar'} esta reserva?
              </h5>
              <div className="text-center">
                <button
                  className="btn btn-secondary me-3"
                  onClick={() => setShowConfirmation(false)}
                >
                  Voltar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleConfirmAction}
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TabelaReservas;
