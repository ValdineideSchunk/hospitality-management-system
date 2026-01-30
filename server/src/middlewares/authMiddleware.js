import jwt from 'jsonwebtoken';

// Chave secreta para assinar os tokens (em produção, use variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_mude_em_producao';

// Middleware para verificar token JWT
export const verificarToken = (req, res, next) => {
    try {
        // Pega o token do header Authorization
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                message: 'Token não fornecido. Acesso negado.' 
            });
        }

        // Verifica e decodifica o token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Adiciona os dados do usuário na requisição
        req.usuario = decoded;
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expirado. Faça login novamente.' 
            });
        }
        return res.status(401).json({ 
            message: 'Token inválido. Acesso negado.' 
        });
    }
};

// Função para gerar token
export const gerarToken = (payload) => {
    // Token expira em 8 horas
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};

// Middleware opcional para verificar se é admin
export const verificarAdmin = (req, res, next) => {
    if (req.usuario.cargo !== 'Gerente' && req.usuario.cargo !== 'Administrador') {
        return res.status(403).json({ 
            message: 'Acesso negado. Apenas administradores.' 
        });
    }
    next();
};
