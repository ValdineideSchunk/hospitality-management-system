import React from "react";
import "./CalendarBody.css";

const CalendarBody = ({ dates, accommodations, reservations }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "reservado":
        return "#ADD8E6"; // Azul claro
      case "hospedado":
        return "#0000FF"; // Azul escuro
      case "bloqueado":
        return "#FF0000"; // Vermelho
    }
  };
  
  const isDateInRange = (currentDate, start, end) => {
    if (!currentDate || !start || !end) return false;

    const [startDay, startMonth] = start.split("/");
    const [endDay, endMonth] = end.split("/");
    const [currentDay, currentMonth] = currentDate.split("/");

    const startDate = new Date(2024, startMonth - 1, startDay);
    const endDate = new Date(2024, endMonth - 1, endDay);
    const checkDate = new Date(2024, currentMonth - 1, currentDay);

    return checkDate >= startDate && checkDate <= endDate;
  };

  return (
    
    <div className="container-fluid py-3 bg-light" style={{ minHeight: "70vh", width: "100vw" }}>

    
    <div className="row justify-content-center">
        {/* Contêiner da Tabela */}
        <div
            className="table-responsive"
            style={{
              maxHeight: "70vh", // Limita a altura para rolagem vertical
              overflow: "auto",
            }}
        >
          <table
            className="table table-bordered"
            style={{
              width: "max-content", // Faz a tabela expandir conforme o conteúdo
              tableLayout: "auto", // Permite colunas flexíveis
            }}
          >
            <thead className="table-primary">
              <tr>
                <th>Acomodação</th>
                {dates.map((d) => (
                  <th key={d.date}>{d.date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accommodations.map((accommodation) => {
                const roomReservations =
                  reservations[accommodation.nome] || [];
  
                return (
                  <tr key={accommodation.id}>
                    <td>{accommodation.nome}</td>
                    {dates.map((d, index) => {
                      const reservationEnding = roomReservations.find(
                        (r) => r.end === d.date
                      );
                      const reservationStarting = roomReservations.find(
                        (r) => r.start === d.date
                      );
                      const reservationInRange = roomReservations.find(
                        (r) =>
                          isDateInRange(d.date, r.start, r.end)
                      );
  
                      return (
                        <td
                          key={d.date}
                          style={{
                            position: "relative",
                            padding: 0,
                            zIndex: 0,
                          }}
                        >
                          {reservationEnding && (
                            <>
                              <div
                                style={{
                                  backgroundColor: getStatusColor(
                                    reservationEnding.status
                                  ),
                                  position: "absolute",
                                  top: "25%",
                                  left: "0",
                                  width: "50%",
                                  height: "50%",
                                  borderRadius:
                                    "0 10px 10px 0",
                                  zIndex: 1,
                                }}
                              ></div>
                              <div
                                style={{
                                  backgroundColor: "#90EE90",
                                  position: "absolute",
                                  top: "25%",
                                  left: "50%",
                                  width: "50%",
                                  height: "50%",
                                  borderRadius:
                                    "10px 0 0 10px",
                                  zIndex: 0,
                                }}
                              ></div>
                            </>
                          )}
  
                          {reservationStarting && (
                            <>
                              <div
                                style={{
                                  backgroundColor: getStatusColor(
                                    reservationStarting.status
                                  ),
                                  position: "absolute",
                                  top: "25%",
                                  left: "50%",
                                  width: "50%",
                                  height: "50%",
                                  borderRadius:
                                    "10px 0 0 10px",
                                  zIndex: 1,
                                }}
                              ></div>
                              <div
                                style={{
                                  backgroundColor: "#90EE90",
                                  position: "absolute",
                                  top: "25%",
                                  left: "0",
                                  width: "50%",
                                  height: "50%",
                                  borderRadius:
                                    "0 10px 10px 0",
                                  zIndex: 0,
                                }}
                              ></div>
                            </>
                          )}
  
                          {!reservationStarting &&
                            !reservationEnding &&
                            reservationInRange && (
                              <div
                                style={{
                                  backgroundColor: getStatusColor(
                                    reservationInRange.status
                                  ),
                                  position: "absolute",
                                  top: "25%",
                                  left: "0",
                                  width: "100%",
                                  height: "50%",
                                  borderRadius: "0",
                                  zIndex: 0,
                                }}
                              ></div>
                            )}
  
                          {!reservationStarting &&
                            !reservationEnding &&
                            !reservationInRange && (
                              <div
                                style={{
                                  backgroundColor: "#90EE90",
                                  position: "absolute",
                                  top: "25%",
                                  left: "0",
                                  width: "100%",
                                  height: "50%",
                                  borderRadius: "0",
                                  zIndex: 0,
                                }}
                              ></div>
                            )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
};

export default CalendarBody;
