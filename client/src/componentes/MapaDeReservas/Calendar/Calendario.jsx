import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";
import axios from "axios";

const Calendario = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );
  const [dates, setDates] = useState([]);
  const [reservations, setReservations] = useState({});
  const [accommodations, setAccommodations] = useState([]); // Todas as acomodações

  useEffect(() => {
    const generateDates = (start, end) => {
      const dateArray = [];
      let currentDate = new Date(start);

      while (currentDate <= end) {
        dateArray.push({
          date: currentDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setDates(dateArray);
    };

    generateDates(startDate, endDate);

    const fetchData = async () => {
      try {
        // Requisição para buscar todas as acomodações
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const accommodationsResponse = await axios.get(
          `${apiUrl}/acomodacoes`
        );
        const accommodationsData = accommodationsResponse.data;

        setAccommodations(accommodationsData);

        // Requisição para buscar todas as reservas
        const reservationsResponse = await axios.get(
          `${apiUrl}/reservas`
        );
        const reservationsData = reservationsResponse.data;

        // Formata as reservas agrupadas por acomodação e filtra os status permitidos
        const formattedReservations = reservationsData.reduce((acc, reserva) => {
          const {
            nome_acomodacao: room,
            data_checkin,
            data_checkout,
            nome_hospede: name,
            status_reserva: status,
          } = reserva;

          // Filtra apenas os status permitidos
          if (!["reservado", "hospedado", "bloqueado"].includes(status)) {
            return acc; // Ignora reservas com status inválido
          }

          const start = new Date(data_checkin).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          });
          const end = new Date(data_checkout).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          });

          if (!acc[room]) acc[room] = [];
          acc[room].push({ start, end, name, status });

          return acc;
        }, {});

        setReservations(formattedReservations);
      } catch (error) {
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="calendar-container">
      <CalendarHeader
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <CalendarBody
        dates={dates}
        accommodations={accommodations}
        reservations={reservations}
      />
    </div>
  );
};

export default Calendario;
