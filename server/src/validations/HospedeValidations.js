const params = [
    'nome_hospede',
    'cpf',
    'rg',
    'data_nascimento',
    'sexo',
    'profissao',
    'observacoes',
    'rua',
    'numero',  
    'cidade',                 
    'estado',  
    'cep',            
    'bairro',
    'complemento',
    'observacoes_endereco',               
    'email',    
    'celular',                  
];

export function isNullOrEmpty(value) {
    return (value === null || value === '' || value === undefined);
}

export function validateHospede(aula) {
    return params.some(param => 
        isNullOrEmpty(aula[param]));
}
