import { saveAs } from "file-saver";

export const txtReserva = (reservaData, nomeHospede, nomeAcomodacao) => {

  function formatDateToSlash(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatDateTimeNow() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} às ${hours}:${minutes}:${seconds}`;
  }

  // Formatar datas de check-in e check-out
  const formattedCheckin = formatDateToSlash(reservaData.data_checkin);
  const formattedCheckout = formatDateToSlash(reservaData.data_checkout);

  // Obter data e hora atuais
  const reservaCriadaEm = formatDateTimeNow();

  const reservaText = `
  ====================================
         🏨 DETALHES DA RESERVA 🏨
====================================

🔑 **INFORMAÇÕES DA RESERVA**:
------------------------------------
👤 **Hóspede:**           ${reservaData.nome_hospede}
🏠 **Acomodação:**        ${reservaData.nome}
📅 **Check-in:**          ${formattedCheckin}
📅 **Check-out:**         ${formattedCheckout}
👨‍👩‍👧‍👦 **Adultos:**          ${reservaData.numero_adulto}
🧒 **Crianças:**          ${reservaData.numero_crianca}
💵 **Valor da Diária:**    R$ ${reservaData.valor_diaria}
✅ **Pago:**              ${reservaData.pago ? 'Sim' : 'Não'}
📝 **Observações:**       ${reservaData.observacoes || 'Nenhuma'}
📌 **Status da Reserva:** ${reservaData.status_reserva}

------------------------------------
📅 **Reserva feita em:**  ${reservaCriadaEm}

====================================
       🌴 Hospeda Fácil 🌴
====================================

    `;
    
  const blob = new Blob([reservaText], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `Reserva_${nomeHospede+"."+reservaCriadaEm}.txt`); // Nome do arquivo com base no nome do hóspede
};
