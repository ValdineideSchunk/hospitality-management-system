import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o useNavigate
import FormCadReserva from '../Reservas/FormCadReserva';
import 'bootstrap/dist/css/bootstrap.min.css';

function CadastroReserva() {
  const navigate = useNavigate(); // Inicializando o navigate

  // Função assíncrona para cadastrar uma nova reserva
  async function cadastrarReserva(infoReserva) {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const resposta = await fetch(`${apiUrl}/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(infoReserva), // Envia os dados como JSON, incluindo o ID do hóspede
      });

      if (!resposta.ok) {
      } else {
        // Redireciona para a página de reservas após sucesso
        navigate("/tabela_reserva", {
          state: { alert: { message: "Reserva cadastrada com sucesso!", type: "success" } },
        });
      }
    } catch (error) {
    }
  }

  return (
    <div className="d-flex">
      <FormCadReserva
        handleSubmit={cadastrarReserva} // Passa a função de cadastro
      />
    </div>
  );
}

export default CadastroReserva;
