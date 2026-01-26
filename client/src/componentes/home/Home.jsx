import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Função para formatar datas no formato dd-MM-yyyy
function formatDateToDash(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const Home = () => {
  const [acomodacoes, setAcomodacoes] = useState([]); // Estado para armazenar as acomodações
  const [loading, setLoading] = useState(true); // Estado para exibir o indicador de carregamento
  const [showConfirmation, setShowConfirmation] = useState(false); // Estado para controlar a exibição do modal de confirmação
  const [selectedAcomodacao, setSelectedAcomodacao] = useState(null); // Estado para armazenar a acomodação selecionada
  const [selectedReserva, setSelectedReserva] = useState(null); // Estado para armazenar a reserva selecionada
  const [newStatus, setNewStatus] = useState(''); // Estado para armazenar o novo status da acomodação ou reserva
  const [showPaymentWarning, setShowPaymentWarning] = useState(false); // Estado para controlar o modal de aviso


  // Função para buscar acomodações e seus respectivos status
  const fetchAcomodacoesComStatus = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/acomodacoes`);
      if (!response.ok) {
        throw new Error('Erro ao buscar acomodações');
      }

      const acomodacoesData = await response.json(); // Dados recebidos do backend
      const dataAtual = new Date().toLocaleDateString('en-CA'); // Data atual no formato ISO

      // Atualizando os status das acomodações com base nas reservas e na verificação de "em limpeza"
      const acomodacoesComStatus = await Promise.all(
        acomodacoesData.map(async (acomodacao) => {
          if (acomodacao.status.toLowerCase() === 'em limpeza') {
            return { ...acomodacao, nomeHospede: '-', dataCheckin: '-', dataCheckout: '-', idReserva: null };
          }

          try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const reservaResponse = await fetch(
              `${apiUrl}/status/${acomodacao.id}?data=${dataAtual}`
            );

            if (reservaResponse.status === 404) {
              return { ...acomodacao, status: 'disponível', nomeHospede: '-', dataCheckin: '-', dataCheckout: '-', idReserva: null };
            }

            if (!reservaResponse.ok) {
              throw new Error(`Erro ao buscar reservas para acomodação ${acomodacao.id}`);
            }

            const reservaData = await reservaResponse.json();

            const status = reservaData?.status_reserva?.toLowerCase() || 'disponível';

            if (!['reservado', 'hospedado', 'bloqueado'].includes(status)) {
              return { ...acomodacao, status: 'disponível', nomeHospede: '-', dataCheckin: '-', dataCheckout: '-', idReserva: null };
            }

            const nomeHospede = reservaData?.nome_hospede || 'Sem hóspede';
            const dataCheckin = reservaData?.data_checkin ? formatDateToDash(reservaData.data_checkin) : '-';
            const dataCheckout = reservaData?.data_checkout ? formatDateToDash(reservaData.data_checkout) : '-';
            const idReserva = reservaData?.id_reserva || null;
            const pago = reservaData.pago

            return {
              ...acomodacao,
              status,
              nomeHospede,
              dataCheckin,
              dataCheckout,
              idReserva,
              pago,
            };
          } catch (error) {
            console.error(`Erro na acomodação ${acomodacao.id}:`, error);
            return { ...acomodacao, status: 'indefinido', nomeHospede: '-', dataCheckin: '-', dataCheckout: '-', idReserva: null };
          }
        })
      );

      setAcomodacoes(acomodacoesComStatus); // Atualiza o estado com os dados das acomodações
    } catch (error) {
    } finally {
      setLoading(false); // Define o carregamento como concluído
    }
  };

  useEffect(() => {
    fetchAcomodacoesComStatus();
  }, []);

  // Função para atualizar o status da acomodação
  const handleAcomodacaoStatusAction = async () => {
    if (!selectedAcomodacao || newStatus !== 'disponível') return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const resposta = await fetch(`${apiUrl}/acomodacoes/${selectedAcomodacao}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!resposta.ok) {
        throw new Error(`Erro ao atualizar status da acomodação ${selectedAcomodacao}`);
      }

      setShowConfirmation(false);
      fetchAcomodacoesComStatus();
    } catch (error) {
    }
  };

  // Função para atualizar o status da reserva
  const handleReservaStatusAction = async () => {
    if (!selectedReserva || !newStatus) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const resposta = await fetch(`${apiUrl}/reservas/${selectedReserva}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ novoStatus: newStatus }),
      });

      if (!resposta.ok) {
        throw new Error(`Erro ao atualizar status da reserva ${selectedReserva}`);
      }

      setShowConfirmation(false);
      fetchAcomodacoesComStatus();
    } catch (error) {
    }
  };

  const openConfirmationModal = (id, novoStatus, type = 'acomodacao') => {
    if (type === 'acomodacao') {
      setSelectedAcomodacao(id);
    } else {
      setSelectedReserva(id);
    }
    setNewStatus(novoStatus);
    setShowConfirmation(true);
  };

  const handleAction = () => {
    if (newStatus === 'disponível') {
      handleAcomodacaoStatusAction();
    } else {
      handleReservaStatusAction();
    }
  };

  const getCardStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'reservado':
        return { backgroundColor: '#ADD8E6', color: '#000' }; // Azul claro
      case 'hospedado':
        return { backgroundColor: '#0000FF', color: '#FFF' }; // Azul escuro
      case 'bloqueado':
        return { backgroundColor: '#FF0000', color: '#FFF' }; // Vermelho
      case 'em limpeza':
        return { backgroundColor: '#FFA500', color: '#000' }; // Laranja
      default:
        return { backgroundColor: '#90EE90', color: '#000' }; // Verde (Disponível)
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Carregando...</div>;
  }

  return (
    <div className="container-fluid mt-3" style={{ maxWidth: '99%' }}>
      <h2 className="text-center mb-4">Gerenciamento de Acomodações</h2>
       {/* Índice de cores */}
    <div className="row mb-4">
      <div className="col text-center">
        <div className="d-flex justify-content-center align-items-center flex-wrap">
          <div
            className="d-flex align-items-center m-2"
            style={{
              backgroundColor: '#ADD8E6',
              width: '20px',
              height: '20px',
              borderRadius: '3px',
            }}
          ></div>
          <span className="ms-2">Reservado</span>

          <div
            className="d-flex align-items-center m-2 ms-4"
            style={{
              backgroundColor: '#0000FF',
              width: '20px',
              height: '20px',
              borderRadius: '3px',
            }}
          ></div>
          <span className="ms-2">Hospedado</span>

          <div
            className="d-flex align-items-center m-2 ms-4"
            style={{
              backgroundColor: '#FF0000',
              width: '20px',
              height: '20px',
              borderRadius: '3px',
            }}
          ></div>
          <span className="ms-2">Bloqueado</span>

          <div
            className="d-flex align-items-center m-2 ms-4"
            style={{
              backgroundColor: '#FFA500',
              width: '20px',
              height: '20px',
              borderRadius: '3px',
            }}
          ></div>
          <span className="ms-2">Em Limpeza</span>

          <div
            className="d-flex align-items-center m-2 ms-4"
            style={{
              backgroundColor: '#90EE90',
              width: '20px',
              height: '20px',
              borderRadius: '3px',
            }}
          ></div>
          <span className="ms-2">Disponível</span>
        </div>
      </div>
    </div>
      <div className="custom-scroll-container" style={{ maxHeight: '90vh', overflowY: 'auto', paddingRight: '15px' }}>
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
          {acomodacoes.map((acomodacao) => (
            <div className="col" key={acomodacao.id}>
              <div className="card h-100 d-flex flex-column" style={getCardStyle(acomodacao.status)}>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{acomodacao.nome}</h5>
                  {acomodacao.status.toLowerCase() === 'disponível' ? (
                    <>
                      <p className="card-text">Capacidade: {acomodacao.capacidade} pessoas</p>
                      <p className="card-text">Comodidades:</p>
                      <ul>
                        {acomodacao.wifi === 1 && <li>Wi-Fi</li>}
                        {acomodacao.tv === 1 && <li>TV</li>}
                        {acomodacao.arCondicionado === 1 && <li>Ar Condicionado</li>}
                        {acomodacao.frigobar === 1 && <li>Frigobar</li>}
                        {acomodacao.banheirosAdaptados === 1 && <li>Banheiros Adaptados</li>}
                        {acomodacao.sinalizacaoBraille === 1 && <li>Sinalização em Braille</li>}
                        {acomodacao.entradaAcessivel === 1 && <li>Entrada Acessível</li>}
                        {acomodacao.estacionamentoAcessivel === 1 && <li>Estacionamento Acessível</li>}
                      </ul>
                    </>
                  ) : acomodacao.status.toLowerCase() === 'em limpeza' ? (
                    <p className="card-text">Acomodação em processo de limpeza.</p>
                  ) : acomodacao.status.toLowerCase() === 'bloqueado' ? (
                    <>
                      <p className="card-text">Data Início Bloqueio: {acomodacao.dataCheckin}</p>
                      <p className="card-text">Data Fim Bloqueio: {acomodacao.dataCheckout}</p>
                    </>
                  ) : (
                    <>
                      <p className="card-text">Hóspede: {acomodacao.nomeHospede}</p>
                      <p className="card-text">Check-in: {acomodacao.dataCheckin}</p>
                      <p className="card-text">Check-out: {acomodacao.dataCheckout}</p>
                      <p className="card-text">Pago: {acomodacao.pago?.trim().toLowerCase() === 'sim' ? 'Sim' : 'Não'}</p>

                      {acomodacao.idReserva && (
                        <p className="card-text">ID da Reserva: {acomodacao.idReserva}</p>
                      )}
                    </>
                  )}
                  <p className="card-text mt-auto">
                    Status: <span className="badge bg-light text-dark">{acomodacao.status}</span>
                  </p>
                </div>
                <div className="mt-auto p-3">
                  {acomodacao.status.toLowerCase() === 'disponível' && (
                    <button
                      className="btn btn-primary mt-2 w-100"
                      onClick={() => {
                        window.location.href = '/cadastro_reserva';
                      }}
                    >
                      Nova Reserva
                    </button>
                  )}
                  {acomodacao.status.toLowerCase() === 'em limpeza' && (
                    <button
                      className="btn btn-primary mt-2 w-100"
                      onClick={() => openConfirmationModal(acomodacao.id, 'disponível', 'acomodacao')}
                    >
                      Finalizar Limpeza
                    </button>
                  )}
                  {(acomodacao.status.toLowerCase() === 'reservado' || acomodacao.status.toLowerCase() === 'hospedado') && (
                    <>
                      <button
                        className="btn btn-primary mt-2 w-100"
                        onClick={() => {
                          if (
                            acomodacao.status.toLowerCase() === 'hospedado' &&
                            acomodacao.pago?.trim().toLowerCase() !== 'sim'
                          ) {
                            setShowPaymentWarning(true); // Exibe o modal de aviso
                            return;
                          }

                          openConfirmationModal(
                            acomodacao.idReserva,
                            acomodacao.status.toLowerCase() === 'reservado' ? 'hospedado' : 'finalizada',
                            'reserva'
                          );
                        }}
                      >
                        {acomodacao.status.toLowerCase() === 'reservado' ? 'Hospedar' : 'Finalizar Reserva'}
                      </button>

                      <button
                        className="btn btn-primary mt-2 w-100"
                        onClick={() => {
                          window.location.href = `/cadastro_reserva/${acomodacao.idReserva}`;
                        }}
                      >
                        Ver Detalhes
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPaymentWarning && (
        <div
          className="position-fixed top-50 start-50 translate-middle bg-light border rounded shadow-lg p-4 w-50"
          style={{ zIndex: 1060 }}
        >
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
      )}

      {showConfirmation && (
        <div
          className="position-fixed top-50 start-50 translate-middle bg-light border rounded shadow-lg p-4 w-50"
          style={{ zIndex: 1060 }}
        >
          <h5 className="text-center mb-3">
            {selectedReserva && newStatus === 'hospedado' && (
              <>Deseja realmente hospedar a reserva selecionada?</>
            )}
            {selectedReserva && newStatus === 'finalizada' && (
              <>Deseja realmente finalizar a reserva selecionada?</>
            )}
            {selectedAcomodacao && newStatus === 'disponível' && (
              <>Deseja realmente finalizar a limpeza da acomodação?</>
            )}
          </h5>
          <div className="text-center">
            <button className="btn btn-secondary me-3" onClick={() => setShowConfirmation(false)}>
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={handleAction}>
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
