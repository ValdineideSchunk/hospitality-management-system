/**
 * Valida se um CPF é válido
 * @param {string} cpf - CPF a ser validado (com ou sem formatação)
 * @returns {boolean} - true se o CPF é válido, false caso contrário
 */
export const validarCPF = (cpf) => {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, "");
  
  // Verifica se tem 11 dígitos ou se todos os dígitos são iguais
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Função auxiliar para calcular os dígitos verificadores
  const calcularDigito = (baseCpf, pesoInicial) => {
    let soma = 0;
    for (let i = 0; i < baseCpf.length; i++) {
      soma += parseInt(baseCpf[i]) * (pesoInicial - i);
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  // Calcula os dois dígitos verificadores
  const digito1 = calcularDigito(cpf.slice(0, 9), 10);
  const digito2 = calcularDigito(cpf.slice(0, 10), 11);

  // Verifica se os dígitos calculados conferem com os informados
  return digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10]);
};

/**
 * Formata um CPF para o padrão XXX.XXX.XXX-XX
 * @param {string} cpf - CPF a ser formatado (apenas números)
 * @returns {string} - CPF formatado
 */
export const formatarCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, "");
  
  if (cpf.length <= 11) {
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  
  return cpf;
};

/**
 * Remove a formatação de um CPF
 * @param {string} cpf - CPF formatado
 * @returns {string} - CPF sem formatação (apenas números)
 */
export const limparCPF = (cpf) => {
  return cpf.replace(/\D/g, "");
};

/**
 * Valida o formato de um CEP
 * @param {string} cep - CEP a ser validado (apenas números)
 * @returns {boolean} - true se o CEP tem 8 dígitos, false caso contrário
 */
export const validarFormatoCEP = (cep) => {
  const cepLimpo = cep.replace(/\D/g, "");
  return cepLimpo.length === 8;
};

/**
 * Valida se um CEP existe consultando a API ViaCEP
 * @param {string} cep - CEP a ser validado (apenas números)
 * @returns {Promise<{valido: boolean, mensagem: string, dados?: object}>}
 */
export const validarCEPAPI = async (cep) => {
  try {
    const cepLimpo = cep.replace(/\D/g, "");
    
    // Verifica formato
    if (cepLimpo.length !== 8) {
      return {
        valido: false,
        mensagem: "CEP deve conter exatamente 8 dígitos.",
      };
    }

    const baseUrl = process.env.REACT_APP_VIACEP_URL || 'https://viacep.com.br/ws';
    const url = `${baseUrl}/${cepLimpo}/json/`;
    
    const response = await fetch(url);

    if (!response.ok) {
      return {
        valido: false,
        mensagem: "Erro ao consultar CEP. Tente novamente.",
      };
    }

    const data = await response.json();

    // CEP não encontrado
    if (data.erro) {
      return {
        valido: false,
        mensagem: "CEP não encontrado. Verifique e tente novamente.",
      };
    }

    // Verifica se os dados estão preenchidos
    if (!data.localidade || !data.uf) {
      return {
        valido: false,
        mensagem: "CEP retornou dados incompletos. Tente outro CEP.",
      };
    }

    // Retorna sucesso com os dados do endereço
    return {
      valido: true,
      mensagem: "CEP válido!",
      dados: {
        estado: data.uf || "",
        cidade: data.localidade || "",
        bairro: data.bairro || "",
        rua: data.logradouro || "",
        complemento: data.complemento || "",
      },
    };
  } catch (error) {
    return {
      valido: false,
      mensagem: "Erro ao validar CEP. Verifique sua conexão.",
    };
  }
};

/**
 * Formata um CEP para o padrão XXXXX-XXX
 * @param {string} cep - CEP a ser formatado (apenas números)
 * @returns {string} - CEP formatado
 */
export const formatarCEP = (cep) => {
  const cepLimpo = cep.replace(/\D/g, "");
  return cepLimpo.replace(/^(\d{5})(\d{3})$/, "$1-$2");
};

/**
 * Verifica se um CPF já está cadastrado no banco de dados
 * @param {string} cpf - CPF a ser verificado (apenas números)
 * @returns {Promise<{existe: boolean, hospede?: object, erro: boolean, mensagem?: string}>}
 */
export const verificarCPFBancoDados = async (cpf) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const cepLimpo = cpf.replace(/\D/g, "");
    
    const response = await fetch(`${apiUrl}/verificar-cpf/${cepLimpo}`);
    
    if (!response.ok) {
      return {
        existe: false,
        erro: true,
        mensagem: "Erro ao verificar CPF no banco de dados.",
      };
    }

    const data = await response.json();
    
    if (data.existe) {
      return {
        existe: true,
        erro: false,
        hospede: data.hospede,
        mensagem: `Este CPF já está cadastrado no sistema (${data.hospede.nome_hospede}).`,
      };
    }

    return {
      existe: false,
      erro: false,
      mensagem: "CPF disponível para cadastro.",
    };
  } catch (error) {
    console.error("Erro ao verificar CPF:", error);
    return {
      existe: false,
      erro: true,
      mensagem: "Erro ao conectar com o servidor.",
    };
  }
};
