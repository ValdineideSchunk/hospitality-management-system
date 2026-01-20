const params = [
    'rg'
  ];
  
  
  export function isNullOrEmpty(value) {
    return value === null || value === '' || value === undefined;
  }
  
  export function validateFuncionario(funcionario) {
    return params.some((param) => {
      return isNullOrEmpty(funcionario[param]);
    });
  }
  