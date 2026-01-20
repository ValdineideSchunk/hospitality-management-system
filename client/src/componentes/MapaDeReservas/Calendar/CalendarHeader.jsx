import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa"; // Ícones de setas duplas

const CalendarHeader = ({ startDate, endDate, setStartDate, setEndDate }) => {
  const handlePreviousPeriod = () => {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    // Retrocede um mês inteiro
    newStartDate.setMonth(newStartDate.getMonth() - 1);
    newEndDate.setMonth(newEndDate.getMonth() - 1);

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleNextPeriod = () => {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    // Avança um mês inteiro
    newStartDate.setMonth(newStartDate.getMonth() + 1);
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <>
      <div
        className="position-fixed start-50 translate-middle-x bg-light border py-1 px-4 rounded d-flex flex-column align-items-center gap-3"
        style={{
          zIndex: 1050,
          width: "50%",
          top: "20px",
        }}
      >
        <h1 className="mb-3">Mapa de Reserva</h1>
        <div className="d-flex justify-content-center align-items-center gap-3 w-100">
          {/* Botão Anterior com ícone duplo e maior */}
          <button className="btn btn-primary" onClick={handlePreviousPeriod}>
            <FaAngleDoubleLeft size={24} /> {/* Ícone maior (24px) */}
          </button>

          {/* DatePicker para data inicial */}
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              const newEndDate = new Date(date);
              newEndDate.setMonth(newEndDate.getMonth() + 1);
              setStartDate(date);
              setEndDate(newEndDate);
            }}
            dateFormat="dd/MM/yyyy"
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="form-control"
          />
          <span>à</span>
          {/* DatePicker para data final */}
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              const newStartDate = new Date(date);
              newStartDate.setMonth(newStartDate.getMonth() - 1);
              setEndDate(date);
              setStartDate(newStartDate);
            }}
            dateFormat="dd/MM/yyyy"
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            className="form-control"
          />

          {/* Botão Próximo com ícone duplo e maior */}
          <button className="btn btn-primary" onClick={handleNextPeriod}>
            <FaAngleDoubleRight size={24} /> {/* Ícone maior (24px) */}
          </button>
        </div>

        <div
          className="color-legend mb-3"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#ADD8E6",
                width: "20px",
                height: "20px",
                borderRadius: "3px",
                border: "1px solid #000",
              }}
            ></div>
            <span style={{ fontSize: "14px" }}>Reservado</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#0000FF",
                width: "20px",
                height: "20px",
                borderRadius: "3px",
                border: "1px solid #000",
              }}
            ></div>
            <span style={{ fontSize: "14px" }}>Bloqueado</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#FF0000",
                width: "20px",
                height: "20px",
                borderRadius: "3px",
                border: "1px solid #000",
              }}
            ></div>
            <span style={{ fontSize: "14px", color: "#000" }}>Hospedado</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#90EE90",
                width: "20px",
                height: "20px",
                borderRadius: "3px",
                border: "1px solid #000",
              }}
            ></div>
            <span style={{ fontSize: "14px" }}>Disponível</span>
          </div>
        </div>
      </div>
      <div style={{ height: "200px" }}></div>
    </>
  );
};

export default CalendarHeader;
