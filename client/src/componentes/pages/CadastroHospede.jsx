import React from 'react';
import FormCadHospede from '../Hospedes/FormCadHospedes/FormCadHospedes';
import 'bootstrap/dist/css/bootstrap.min.css';

function CadastroHospede() {
  // Função assíncrona para cadastrar um novo hóspede
  async function cadastrarHospede(infoHospede) {
    try {
      const resposta = await fetch('http://localhost:5000/hospede', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia os dados do hóspede no corpo da requisição como JSON
        body: JSON.stringify(infoHospede),
      });
      // Verifica se a resposta da requisição foi bem-sucedida
      if (!resposta.ok) {
        console.log('Erro ao cadastrar Hóspede'); // Log em caso de erro
        console.log('Erro aqui'); 
      } else {
        alert('Hóspede Cadastrado'); // Confirmação para o usuário em caso de sucesso
      }
    } catch (error) {
      console.log('Erro ao cadastrar Hóspede', error); // Log de erro no caso de exceção
    }
  }

  return (
    <div className="d-flex">
      {/* Componente de formulário de cadastro, passando propriedades */}
      <FormCadHospede
        titulo="Cadastro Hóspede"      
        txtBtn="Cadastrar"             
        handleSubmit={cadastrarHospede} 
      />
    </div>
  );
}

export default CadastroHospede;
