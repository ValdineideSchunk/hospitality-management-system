import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import FormReserva from "./FormReserva";
import Alertas from "../layout/Alertas";
import { txtReserva } from '../../services/txtReserva.js';

function FormCadReserva({ handleSubmit }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    status_reserva: "",
    fk_hospede: "",
    data_checkin: "",
    data_checkout: "",
    fk_acomodacao: "",
    numero_adulto: "",
    numero_crianca: '0',
    valor_diaria: "",
    pago: "não",
    observacoes: " ",
    valor_total: "",
  });

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [nomeHospede, setNomeHospede] = useState("");
  const [nomeAcomodacao, setNomeAcomodacao] = useState("");

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
    if (isEditing) {
      fetch(`http://localhost:5000/reservas/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Erro: ${response.status} - ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          const reservaCorrigida = {
            ...data,
            observacoes: data.observacoes?.trim() || ' ',
          };

          setFormData(reservaCorrigida);

          fetch(`http://localhost:5000/hospedes/${data.fk_hospede}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Erro: ${response.status} - ${response.statusText}`);
              }
              return response.json();
            })
            .then((hospedeData) => {
              setNomeHospede(hospedeData.nome_hospede);
            })
            .catch((error) => {
            });

          fetch(`http://localhost:5000/acomodacoes/${data.fk_acomodacao}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Erro: ${response.status} - ${response.statusText}`);
              }
              return response.json();
            })
            .then((acomodacaoData) => {
              setNomeAcomodacao(acomodacaoData.nome);
            })
            .catch((error) => {
            });
        })
        .catch((error) => {
        });
    }
  }, [id, isEditing]);

  const isDataValida = () => {
    if (formData.data_checkin && formData.data_checkout) {
      const dataInicio = new Date(formData.data_checkin);
      const dataFim = new Date(formData.data_checkout);
      if (dataInicio >= dataFim) {
        showAlert(
          "A data de saída não pode ser anterior ou igual à data de entrada.",
          "danger"
        );
        setFormData((prevState) => ({
          ...prevState,
          data_checkin: "",
          data_checkout: "",
        }));
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (formData.data_checkin && formData.data_checkout) {
      isDataValida();
    }
    const validarDatas = () => {
      if (!isDataValida()) {
        return;
      }
      setDataInicio(formData.data_checkin);
      setDataFim(formData.data_checkout);
    };

    if (formData.data_checkin && formData.data_checkout) {
      validarDatas();
    }
  }, [formData.data_checkin, formData.data_checkout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    if (!isDataValida()) {
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (!formData.status_reserva) {
      showAlert("O campo Situação é obrigatório.", "danger");
      return;
    }

    if (!formData.fk_hospede) {
      showAlert("O campo Hóspede é obrigatório.", "danger");
      return;
    }

    if (!formData.data_checkin) {
      showAlert("O campo Data de Entrada é obrigatório.", "danger");
      return;
    }

    if (!formData.data_checkout) {
      showAlert("O campo Data de Saída é obrigatório.", "danger");
      return;
    }

    if (!formData.fk_acomodacao) {
      showAlert("O campo Acomodação é obrigatório.", "danger");
      return;
    }

    if (!formData.numero_adulto || parseInt(formData.numero_adulto) < 1) {
      showAlert("O campo Nº de Adultos é obrigatório e deve ser maior que 0.", "danger");
      return;
    }

    const numeroCrianca = parseInt(formData.numero_crianca);
    if (isNaN(numeroCrianca) || numeroCrianca < 0) {
      showAlert("O campo Nº de Crianças deve ser um número válido maior ou igual a 0.", "danger");
      return;
    }

    if (formData.valor_diaria === "" || isNaN(parseFloat(formData.valor_diaria))) {
      showAlert("O campo Valor da Diária é obrigatório e deve ser um número válido.", "danger");
      return;
    }

    if (!formData.observacoes || !String(formData.observacoes).trim()) {
      setFormData(prevData => ({
        ...prevData,
        observacoes: ' ',
      }));
    }

    if (isEditing) {
      fetch(`http://localhost:5000/reservas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Erro: ${response.status} - ${response.statusText}`
            );
          }
          return response.json();
        })
        .then(() => {
          navigate("/tabela_reserva", {
            state: { alert: { message: "Reserva atualizada com sucesso!", type: "success" } },
          });
        })
        .catch((error) => {
          console.error("Erro ao atualizar a reserva:", error);
        });
    } else {
      handleSubmit(formData);
    }
  };

  const isNonEditable = isEditing && (formData.status_reserva === "cancelada" || formData.status_reserva === "finalizada");

  return (
    <div className="container mt-4">
      <Alertas
        show={alertProps.show}
        variant={alertProps.variant}
        message={alertProps.message}
        onClose={() => setAlertProps((prev) => ({ ...prev, show: false }))} />
      <h2 style={{ marginLeft: "40px" }}>
        {isNonEditable ? "Visualizando uma Reserva" : isEditing ? "Editar Reserva" : "Nova Reserva"}
      </h2>
      <Form onSubmit={submit}>
        <FormReserva
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          isEditing={isEditing}
          dataInicio={dataInicio}
          dataFim={dataFim}
          nomeHospede={nomeHospede}
          nomeAcomodacao={nomeAcomodacao}
        />
        <div className="text-center mt-4">
          <Button
            variant="danger"
            className="mt-2 me-2"
            onClick={() => navigate("/tabela_reserva")}
          >
            {isNonEditable ? "Voltar" : "Cancelar"}
          </Button>
          {!isNonEditable && (
            <Button variant="primary" className="mt-2" type="submit">
              {isEditing ? "Salvar Alterações" : "Salvar"}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}

export default FormCadReserva;
