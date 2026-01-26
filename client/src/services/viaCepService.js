/**
 * Serviço para buscar endereço através da API ViaCEP
 * Pode ser reutilizado em qualquer formulário que tenha campo de CEP
 */

export const buscarEnderecoPorCep = async (cep) => {
  try {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const response = await fetch(url);

    if (!response.ok) {
      return {
        erro: true,
        mensagem: "Erro ao consultar CEP. Tente novamente.",
      };
    }

    const data = await response.json();

    // CEP não encontrado
    if (data.erro) {
      return {
        erro: true,
        mensagem: "CEP não encontrado. Verifique e tente novamente.",
      };
    }

    // Verifica se os dados estão preenchidos
    if (!data.localidade && !data.uf && !data.logradouro) {
      return {
        erro: true,
        mensagem: "CEP retornou dados vazios. Tente outro CEP.",
        tipo: "warning",
      };
    }

    // Retorna sucesso com os dados do endereço
    return {
      erro: false,
      mensagem: "Endereço carregado com sucesso!",
      endereco: {
        estado: data.uf || "",
        cidade: data.localidade || "",
        bairro: data.bairro || "",
        rua: data.logradouro || "",
        complemento: data.complemento || "",
      },
    };
  } catch (error) {
    return {
      erro: true,
      mensagem: "Erro ao buscar CEP. Verifique sua conexão.",
    };
  }
};
