import { saveAs } from 'file-saver';

export const txtHospede = (hospedeData) => {
    const hospedeText = `
  ===============================
        FORMULÁRIO DE HÓSPEDE
  ===============================
  
  INFORMAÇÕES DO HÓSPEDE:
  -------------------------
  Nome Do Hospede:        ${hospedeData.nome_hospede}
  CPF:                  ${hospedeData.cpf}
  RG:                   ${hospedeData.rg}
  Data de Nascimento:   ${hospedeData.data_nascimento}
  Sexo:                 ${hospedeData.sexo}
  Profissão:            ${hospedeData.profissao}
  Observações:          ${hospedeData.observacoes}
  
  CONTATOS:
  -------------------------
  E-mail:               ${hospedeData.email}
  Celular:              ${hospedeData.celular}
  
  ===============================
        Pousada Hospeda Fácil
  ===============================
    `;
    
    const blob = new Blob([hospedeText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${hospedeData.nome_hospede}_dados_hospedagem.txt`); // Nome do arquivo com o nome do hóspede
};
