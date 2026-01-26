# Configuração de Variáveis de Ambiente

Este projeto utiliza variáveis de ambiente para configurar URLs da API e outros recursos.

## Arquivos de Configuração

### `.env.local` (não versionar)
Arquivo local com as variáveis específicas do seu ambiente de desenvolvimento.

### `.env.example`
Template das variáveis necessárias. Use como referência para criar o `.env.local`.

## Variáveis Disponíveis

```env
# URL da API Backend (padrão: http://localhost:5000)
REACT_APP_API_URL=http://localhost:5000

# URL do ViaCEP (padrão: https://viacep.com.br/ws)
REACT_APP_VIACEP_URL=https://viacep.com.br/ws
```

## Como Usar

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edite `.env.local`** com os valores do seu ambiente

3. **Restart o servidor de desenvolvimento** para as mudanças terem efeito

## Para Produção

Atualize as variáveis no seu ambiente de deploy:

### Vercel/Netlify
Adicione as variáveis em `Settings > Environment Variables`

### Docker
Use `--env` flag ou arquivo `.env`:
```bash
docker run -e REACT_APP_API_URL=https://api.seu-dominio.com app
```

### Variáveis com Fallback
Todas as URLs têm fallback para `http://localhost:5000`:
```javascript
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

Isso garante que o app funcione mesmo sem a variável estar definida.
