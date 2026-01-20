/*

DROP DATABASE IF EXISTS hospedagem; 
CREATE DATABASE hospedagem;

USE hospedagem;

CREATE TABLE hospedes (
    id_hospede INT AUTO_INCREMENT UNIQUE,
    nome_hospede VARCHAR(40),
    cpf VARCHAR(11) UNIQUE,
    rg VARCHAR(10),
    data_nascimento DATE,
    sexo VARCHAR(20),
    Profissao VARCHAR(50), 
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
    celular VARCHAR(13),
    PRIMARY KEY (id_hospede)
);

SELECT * FROM hospedes;

CREATE TABLE funcionarios (
    id_funcionario INT AUTO_INCREMENT UNIQUE,
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
    senha VARCHAR(255),  
    PRIMARY KEY (id_funcionario)
);

-- Tabela 'acomodacoes' com 'tipo' como ENUM
CREATE TABLE acomodacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
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
   
select * from acomodacao;

CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT UNIQUE,
    fk_hospede INT,
    fk_acomodacao INT,
    data_checkin DATE,
    data_checkout DATE,
    valor_diaria FLOAT,
    numero_adulto INTEGER,
    numero_crianca INTEGER,
    quantidade_diarias INT,
    valor_total DECIMAL(10, 2),
    observacoes VARCHAR(200),
    status_reserva VARCHAR(40),
    pago ENUM('sim', 'não') DEFAULT 'não',
    data_criacao_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_hospede) REFERENCES hospedes(id_hospede) ON UPDATE CASCADE,
    FOREIGN KEY (fk_acomodacao) REFERENCES acomodacao(id) ON UPDATE CASCADE
);
 
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
INNER JOIN hospedes h ON r.fk_hospede = h.id_hospede
INNER JOIN acomodacao a ON r.fk_acomodacao = a.id
;

SELECT * FROM funcionarios;
SELECT * FROM hospedes;
SELECT * FROM acomodacao;
SELECT * FROM reservas;
SELECT * FROM view_informacoes_reserva;

SELECT a.*
FROM acomodacao a
WHERE NOT EXISTS (
    SELECT 1
    FROM reservas r
    WHERE r.fk_acomodacao = a.id
    AND (
        (r.data_checkin BETWEEN '2024-11-01' AND '2024-11-20') OR
        (r.data_checkout BETWEEN '2024-11-01' AND '2024-11-20') OR
        ('2024-11-01' BETWEEN r.data_checkin AND r.data_checkout) OR
        ('2024-11-20' BETWEEN r.data_checkin AND r.data_checkout)
    )
);

*/