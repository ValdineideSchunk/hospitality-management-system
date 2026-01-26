import React from 'react';
import FormCadFuncionario from '../Funcionarios/FormCadFuncionario/FormCadFuncionario';
import 'bootstrap/dist/css/bootstrap.min.css';

function CadastroFuncionario() {
  // Função para cadastrar um novo funcionário
  async function cadastrarFuncionario(infoFuncionario) {
    try {
      // Faz uma requisição POST para o backend com os dados do funcionário
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const resposta = await fetch(`${apiUrl}/funcionario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(infoFuncionario), // Converte os dados do funcionário para JSON
      });
      
      // Verifica se a resposta foi bem-sucedida
      if (!resposta.ok) {
      } else {
        alert('Funcionário Cadastrado'); // Exibe um alerta confirmando o cadastro
      }
    } catch (error) {
    }
  }

  return (
    <div className="flex-grow-1 p-3"> {/* Define a área principal do componente, removendo o MenuLateral */}
      <FormCadFuncionario
        titulo="Cadastro Funcionário" // Título do formulário
        txtBtn="Cadastrar" // Texto do botão de envio
        handleSubmit={cadastrarFuncionario} // Função de envio que será chamada ao submeter o formulário
      />
    </div>
  );
}

export default CadastroFuncionario;
