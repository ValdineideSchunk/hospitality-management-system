# Sistema de Gerenciamento de Hospedagens - Pousada Quinta do Ypuã

## Visão Geral

A Pousada Quinta do Ypuã enfrenta desafios na gestão de hospedagens e clientes devido à falta de um sistema centralizado. Atualmente, a gestão é realizada manualmente e através de planilhas, resultando em erros de agendamento, duplicações de reservas e perda de informações. Este projeto visa desenvolver um Sistema de Gerenciamento de Hospedagens baseado na web para resolver esses problemas.

## Objetivo

Desenvolver um sistema web que substitua os processos manuais e as planilhas ineficientes, proporcionando:

- **Redução de Erros:** Minimizar erros humanos comuns em processos manuais.
- **Eficiência Operacional:** Automatizar tarefas repetitivas e demoradas.
- **Melhoria da Experiência do Cliente:** Garantir uma gestão eficiente das reservas e comunicação clara com os hóspedes.
- **Centralização de Informações:** Reunir todas as informações em um único sistema.
- **Controle Financeiro:** Melhorar o controle financeiro com recursos para acompanhamento de pagamentos e faturamento.

## Tecnologias Utilizadas

- **Linguagens de Programação:** Java (para desenvolvimento inicial), JavaScript (para desenvolvimento web)
- **Frameworks e Bibliotecas:**
  - **Frontend:** React (para a construção da interface de usuário)
  - **Backend:** Node.js (para a construção do servidor e lógica de backend)
- **Banco de Dados:** MySQL / MariaDB
- **Ferramenta de Prototipagem:** Figma (para design e prototipagem não funcional)
- **Ambiente de Desenvolvimento:** NetBeans (para prototipagem funcional)
- **Controle de Versão:** Git

## Funcionalidades Principais

### Requisitos Funcionais

- **Cadastro de Hóspedes [RF 001]:** Registro e gerenciamento de perfis de hóspedes.
- **Gerenciamento de Reservas [RF 2]:** Criação, visualização, edição e cancelamento de reservas.
- **Atualização do Status de Limpeza [RF 3]:** Atualização automática e manual do status das acomodações.
- **Gerenciamento de Acomodações [RF 6]:** Cadastro e manutenção de informações sobre acomodações.
- **Monitoramento das Acomodações [RF 7]:** Controle do status das acomodações (disponível, ocupado, em limpeza, etc.).
- **Perfil de Funcionários [RF 8]:** Criação e gerenciamento de perfis de funcionários com informações pessoais e profissionais.
- **Autenticação de Funcionários [RF 11]:** Controle de acesso baseado em credenciais.
- **Histórico de Hospedagens [RF 12]:** Registro das estadias anteriores dos hóspedes.
- **Gestão de Convidados [RF 13]:** Registro de acompanhantes ou convidados adicionais.
- **Gestão de Lista de Espera [RF 14]:** Gerenciamento de lista de espera para acomodações.
- **Acesso Remoto [RF 15]:** Acesso ao sistema de qualquer local com conexão à internet.
- **Responsividade [RF 16]:** Interface adaptativa para diferentes tamanhos de tela e dispositivos.
- **Compatibilidade com Navegadores [RF 17]:** Suporte aos principais navegadores web.
- **Integração com Serviços Web [RF 19]:** Conexão com APIs externas para pagamentos online, envio de e-mails, etc.

### Requisitos Não Funcionais

- **Gerenciamento de Relatórios [RNF 1]:** Geração de relatórios detalhados sobre ocupação e receita.
- **Segurança de Informações dos Hóspedes [RNF 2]:** Proteção dos dados dos hóspedes com criptografia e medidas de segurança.
- **Agilidade e Eficiência [RNF 3]:** Desempenho rápido e responsivo.
- **Confiabilidade do Sistema [RNF 4]:** Alta disponibilidade e minimização do tempo de inatividade.
- **Escalabilidade [RNF 5]:** Capacidade de crescer conforme o aumento das reservas e hóspedes.
- **Manutenção [RNF 6]:** Facilidade para manutenção e atualização do sistema.
- **Verificação Automática [RNF 7]:** Funcionalidades para evitar reservas duplicadas.
- **Interface Intuitiva [RNF 8]:** Design fácil de usar e entender.
- **Gestão de Recursos [RNF 11]:** Controle de recursos do hotel, como roupas de cama e produtos de limpeza.
- **Segurança da Web [RNF 14]:** Implementação de HTTPS, proteção contra CSRF e validação de entradas.
- **Backup e Recuperação [RNF 15]:** Mecanismos para backup e recuperação de dados.
- **Performance e Escalabilidade na Web [RNF 16]:** Suporte a acessos simultâneos e desempenho adequado.
- **Suporte a Navegadores Móveis [RNF 17]:** Navegação otimizada para dispositivos móveis.

## Instalação

Para instalar e configurar o sistema localmente:

1. Clone o repositório:
   ```sh
   git clone https://github.com/usuario/repo.git
   ```

2. Navegue até o diretório do projeto:
   ```sh
   cd repo
   ```

3. Instale as dependências:
   ```sh
   npm install
   ```

4. Configure o ambiente (veja o arquivo `.env.example` para variáveis necessárias).

5. Inicie o servidor:
   ```sh
   npm start
   ```

## Contribuição

Contribuições são bem-vindas! Para contribuir com o projeto, siga estas etapas:

1. Faça um fork do repositório.
2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`).
3. Faça suas alterações e adicione commits (`git commit -am 'Adiciona nova funcionalidade'`).
4. Envie suas alterações para o repositório remoto (`git push origin feature/nova-funcionalidade`).
5. Abra um pull request.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).  

## Contato

Para mais informações ou dúvidas, entre em contato com Linkedins: Valdineide Schunk: www.linkedin.com/in/valdineide-schunk, Vitor Casotti:www.linkedin.com/in/vitor-casotti-667a14285, Mateus Barboza: www.linkedin.com/in/mateus-barboza-santana.
