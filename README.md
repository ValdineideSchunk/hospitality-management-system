# Hospitality Management System

Um sistema web completo para gerenciamento de hospedagem, automatizando reservas, hóspedes, acomodações e relatórios financeiros.

## O Sistema

O sistema substitui planilhas manuais por uma plataforma integrada que centraliza:
- Cadastro e gestão de hóspedes com validações robustas
- Sistema completo de reservas com verificação de conflitos
- Controle de acomodações e disponibilidade
- Relatórios financeiros em tempo real
- Gestão de funcionários com autenticação segura

## Stack Tecnológico

### Frontend
- **React** 18.3 + React Router 6.26
- **Bootstrap 5** + React Bootstrap
- **Chart.js** para gráficos de relatórios
- **Axios** para consumir API REST

### Backend  
- **Node.js + Express** 4.21 (API REST)
- **MySQL2** com pool de conexões
- **Bcrypt** para criptografia de senhas
- **Express Validator** para validação de dados

### Banco de Dados
- **MySQL / MariaDB**

## Principais Funcionalidades

✅ **Cadastro de Hóspedes**
- Validação de CPF com detecção de duplicidade
- Integração ViaCEP para preenchimento automático de endereço
- Bloqueio de avanço com CPF inválido ou duplicado

✅ **Sistema de Reservas**
- Criação, edição e cancelamento de reservas
- Verificação automática de conflitos
- Mapa visual de reservas por período
- Validação de datas e disponibilidade

✅ **Gerenciamento de Acomodações**
- Cadastro com informações completas
- Status em tempo real (disponível, ocupado, limpeza, bloqueado)
- Bloqueio de períodos para manutenção

✅ **Relatórios Financeiros**
- Relatório de receita e ocupação
- Previsão de ganhos
- Gráficos interativos

✅ **Gestão de Funcionários**
- Cadastro com dados profissionais
- Autenticação com criptografia BCrypt
- Controle de acesso

## Como Rodar

### Pré-requisitos
- Node.js 16+
- MySQL/MariaDB rodando

### Instalação

```bash
# Clonar repositório
git clone https://github.com/ValdineideSchunk/hospitality-management-system.git
cd hospitality-management-system

# Configurar servidor
cd server
npm install

# Configurar banco de dados
# Edite server/src/conexao.js com os dados do MySQL
# Exemplo:
# host: "localhost"
# user: "root"
# password: "sua_senha"
# database: "hospedagem"

# Iniciar servidor
npm start

# Em outro terminal - Configurar cliente
cd client
npm install
npm start
# Acesso em http://localhost:3000
```

## Variáveis de Ambiente

### Frontend (client)
- `REACT_APP_API_URL` (padrão: http://localhost:5000)
- `REACT_APP_VIACEP_URL` (padrão: https://viacep.com.br/ws)

> Consulte também: `client/ENV_SETUP.md`

### Backend (server)
- `JWT_SECRET` (opcional) — se não definido, usa uma chave padrão no middleware de autenticação.

## Endpoints Principais

| Recurso | Método | Rota |
|---------|--------|------|
| Login | POST | `/logar/` |
| Listar hóspedes | GET | `/hospede` |
| Cadastrar hóspede | POST | `/hospede` |
| Verificar CPF | GET | `/verificar-cpf/:cpf` |
| Listar reservas | GET | `/reservas` |
| Criar reserva | POST | `/reservas` |
| Relatório financeiro | GET | `/relatorios/financeiro` |

## Arquitetura e Segurança

- Backend estruturado em **MVC** (controllers, models, validations)
- **JWT** para autenticação e rotas protegidas
- **Bcrypt** para hash de senhas

## Estrutura do Projeto

```
├── client/                    # React + componentes
│   ├── componentes/          # Hóspedes, Reservas, Acomodações, Relatórios
│   ├── services/             # ViaCEP, API
│   └── utils/                # Validações (CPF, CEP)
│
└── server/                    # Express + Node.js
    ├── controllers/          # Lógica de negócio
    ├── models/               # Acesso ao banco
    └── validations/          # Validação de entrada
```

## Tecnologias em Destaque

- ✨ Validações robustas (CPF com algoritmo de dígito verificador)
- 🔒 Segurança (BCrypt, validação em frontend e backend)
- 📡 Integração ViaCEP para dados de endereço
- 📊 Relatórios com Chart.js
- 🎨 Interface responsiva com Bootstrap
- ⚡ Async/await no backend para performance

