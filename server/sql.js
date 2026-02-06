/*

DROP DATABASE IF EXISTS hospedagem; 
CREATE DATABASE hospedagem;
USE hospedagem;

-- =========================
-- TABELA HÓSPEDES
-- =========================
CREATE TABLE hospedes (
    id_hospede INT AUTO_INCREMENT PRIMARY KEY,
    nome_hospede VARCHAR(40),
    cpf VARCHAR(11) UNIQUE,
    rg VARCHAR(10),
    data_nascimento DATE,
    sexo VARCHAR(20),
    profissao VARCHAR(50), 
    observacoes VARCHAR(500),
    rua VARCHAR(50),
    numero VARCHAR(10), 
    cidade VARCHAR(30),
    estado VARCHAR(30),
    cep VARCHAR(9),
    bairro VARCHAR(30),
    complemento VARCHAR(50),
    observacoes_endereco VARCHAR(500),
    email VARCHAR(40),
    celular VARCHAR(13)
);

-- =========================
-- TABELA FUNCIONÁRIOS
-- =========================
CREATE TABLE funcionarios (
    id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
    nome_funcionario VARCHAR(40),
    cpf VARCHAR(11) UNIQUE,
    rg VARCHAR(10),
    data_nascimento DATE,
    sexo VARCHAR(20),
    email VARCHAR(40),
    telefone VARCHAR(13),
    observacoes VARCHAR(500),
    cep VARCHAR(9),
    estado VARCHAR(50),
    cidade VARCHAR(50),
    bairro VARCHAR(50),
    logradouro VARCHAR(50),
    numero VARCHAR(10),  
    complemento VARCHAR(50),
    observacoes_endereco VARCHAR(500),
    cargo VARCHAR(20),
    data_admissao DATE,
    data_emissao_carteira DATE,
    banco VARCHAR(40),
    agencia VARCHAR(10), 
    conta VARCHAR(20),   
    status_funcionario VARCHAR(20), 
    observacoes_adicionais VARCHAR(500),
    senha VARCHAR(255)
);

-- =========================
-- TABELA ACOMODAÇÕES
-- =========================
CREATE TABLE acomodacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    capacidade INT,
    tipo VARCHAR(100),
    observacoes TEXT,
    status VARCHAR(50),
    wifi BOOLEAN DEFAULT FALSE,
    tv BOOLEAN DEFAULT FALSE,
    arCondicionado BOOLEAN DEFAULT FALSE,
    frigobar BOOLEAN DEFAULT FALSE,
    banheirosAdaptados BOOLEAN DEFAULT FALSE,
    sinalizacaoBraille BOOLEAN DEFAULT FALSE,
    entradaAcessivel BOOLEAN DEFAULT FALSE,
    estacionamentoAcessivel BOOLEAN DEFAULT FALSE
);

-- =========================
-- TABELA RESERVAS
-- =========================
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    fk_hospede INT,
    fk_acomodacao INT,
    data_checkin DATE,
    data_checkout DATE,
    valor_diaria FLOAT,
    numero_adulto INT,
    numero_crianca INT,
    quantidade_diarias INT,
    valor_total DECIMAL(10, 2),
    observacoes VARCHAR(200),
    status_reserva VARCHAR(40),
    pago ENUM('sim', 'não') DEFAULT 'não',
    data_criacao_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_hospede) REFERENCES hospedes(id_hospede),
    FOREIGN KEY (fk_acomodacao) REFERENCES acomodacao(id)
);

-- =========================
-- TABELA USUÁRIOS
-- =========================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    id_funcionario INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_funcionario) 
        REFERENCES funcionarios(id_funcionario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- VIEW RESERVAS
-- =========================
CREATE VIEW view_informacoes_reserva AS
SELECT 
    r.id_reserva,
    r.fk_hospede,
    h.nome_hospede,
    h.cpf,
    r.data_criacao_reserva,
    r.data_checkin,
    r.data_checkout,
    r.valor_diaria,
    r.numero_adulto,
    r.numero_crianca,
    r.observacoes,
    r.pago,
    r.quantidade_diarias,
    r.valor_total,
    r.status_reserva,
    r.fk_acomodacao,
    a.nome AS nome_acomodacao,  
    a.tipo AS tipo_acomodacao 
FROM reservas r
JOIN hospedes h ON r.fk_hospede = h.id_hospede
JOIN acomodacao a ON r.fk_acomodacao = a.id;

-- ==================================================
-- CRIAÇÃO DO USUÁRIO ADMIN (SE NÃO EXISTIR)
-- ==================================================

-- Funcionário Admin
INSERT INTO funcionarios (
    nome_funcionario, cpf, cargo, data_admissao, status_funcionario, email
)
SELECT 
    'Administrador Sistema',
    '12345678901',
    'Administrador',
    '2024-01-01',
    'Ativo',
    'admin@hospitality-management-system.com'
WHERE NOT EXISTS (
    SELECT 1 FROM funcionarios WHERE cpf = '12345678901'
);

-- Usuário Admin
INSERT INTO usuarios (login, senha, id_funcionario)
SELECT
    '12345678901',
    '$2b$10$fweaEivkp2Zx2KfH0UcQwudFYK4wDHRsXw9eivbNBhZsFMOH/LGia',
    id_funcionario
FROM funcionarios
WHERE cpf = '12345678901'
AND NOT EXISTS (
    SELECT 1 FROM usuarios WHERE login = '12345678901'
);
*/