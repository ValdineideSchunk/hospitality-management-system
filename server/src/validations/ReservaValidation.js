const params = [
    'fk_hospede',
    'fk_acomodacao',
    'data_checkin',
    'data_checkout',
    'valor_diaria',
    'numero_adulto',
    'numero_crianca',
    'pago',
    'observacoes',
    'status_reserva'
];

export function isNullOrEmpty(value) {
    return (value === null || value === '' || value === undefined);
}

export function validateReserva(reserva) {
    return params.some(param => 
        isNullOrEmpty(reserva[param]));
}
