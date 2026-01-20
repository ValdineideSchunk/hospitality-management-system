// Validando Acomodação
export function validarAcomodacao(acomodacao) {
    // Verifique as regras de validação necessárias
    return true; // ou false se a validação falhar
}

// Verificando Erros
export function verificarErros(req, res) {
    // Aqui você pode implementar a lógica de validação
    if (!validarAcomodacao(req.body)) {
        return res.status(400).json({ success: false, message: 'Dados da acomodação inválidos' });
    }
    return null; // Sem erros
}
