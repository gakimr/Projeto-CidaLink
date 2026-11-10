# CidaLink — Frontend React

Base inicial para a migração do frontend do CidaLink para React + Vite, mantendo o backend Node.js existente.

## Instalação
```bash
npm install
npm run dev
```

## API
Configure `VITE_API_URL` no `.env`. A camada `src/services/api.js` centraliza as chamadas ao backend.


## Integração Mobile + API (CidaLink)

A tela **Feed** consulta `GET /postagens` e a tela **Publicar** envia uma ocorrência para `POST /postagens` usando o token salvo no login. O envio inclui categoria, descrição, endereço, coordenadas GPS e foto opcional. A foto deve ser JPG, PNG ou WEBP e ter até 2 MB.

### 1. Configurar o backend

1. Entre em `Back/backend` e instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e preencha os dados reais do MySQL e um `JWT_SECRET` forte.
3. Confirme que o banco `cidalink` e as tabelas do projeto existem.
4. Inicie com `npm start`. O servidor escuta em `0.0.0.0:3000`; `GET /health` deve responder com `status: ok`.

### 2. Configurar o aplicativo mobile

1. Entre em `Mobile/CidaLink-app`.
2. Copie `.env.example` para `.env`.
3. Altere `EXPO_PUBLIC_API_URL` para `http://IP_DO_COMPUTADOR:3000`. Use um endereço que o celular consiga acessar. Não use `localhost` em um celular físico: nesse caso `localhost` aponta para o próprio celular.
4. Instale as dependências com `npm install`.
5. Inicie o Metro para Development Build com `npx expo start --dev-client -c`.

O computador e o celular precisam conseguir se comunicar pela rede. Se estiverem em redes diferentes, houver isolamento do Wi-Fi institucional ou o firewall bloquear a porta 3000, será necessário liberar a conexão ou usar um túnel HTTPS para o backend. O endereço IP varia conforme a rede; por isso ele não foi gravado no código.

### 3. Fluxo de uso

- Faça login no aplicativo. As rotas de ocorrências exigem o token Bearer armazenado pelo `AuthContext`.
- No Feed, puxe a lista para atualizar.
- Em Publicar, selecione a categoria, obtenha a localização do local da ocorrência, informe endereço/descrição e anexe uma foto opcional.
- A API exige latitude e longitude; sem permissão de localização, a publicação não será enviada.

### Observação

A integração de código está preparada, mas a execução ponta a ponta depende das credenciais locais do banco, das tabelas existentes, do `.env` de cada máquina e de uma rede acessível entre celular e computador. Esses dados não fazem parte do ZIP e não podem ser preenchidos automaticamente.
