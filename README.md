# CidaLink

Plataforma cívica que conecta cidadãos e a prefeitura. O cidadão registra problemas urbanos (buraco na rua, iluminação, lixo, saneamento) com foto e localização, acompanha tudo pelo feed e pelo mapa, e a administração responde e atualiza o status de cada ocorrência.

Projeto acadêmico da Fatec Taquaritinga, formado por três partes no mesmo repositório: **API (backend)**, **aplicação web** e **aplicativo mobile**.

## Funcionalidades

**Cidadão**

- Cadastro e login com sessão por token (JWT)
- Criar ocorrência com categoria, descrição, foto e local exato (busca por rua, localização do aparelho ou clique no mapa)
- Feed da comunidade com filtros por status (pendentes, em andamento, resolvidas)
- Mapa com um marcador por ocorrência, colorido pelo status, com prévia da publicação
- Página de cada ocorrência, com a resposta oficial da administração
- Perfil com foto, dados cadastrais, resumo das ocorrências e opção de excluir as pendentes

**Administrador**

- Cadastro protegido por código de administrador
- Botão "Responder / Atualizar" nas ocorrências, para mudar o status e escrever a resposta ao cidadão

**Geral**

- Modo escuro e menu de acessibilidade na versão web

## Tecnologias

| Parte | Tecnologias |
| --- | --- |
| **Backend** | Node.js, Express, MySQL/MariaDB (`mysql2`), JWT (`jsonwebtoken`), `bcryptjs`, Multer (upload de imagens), `dotenv`, CORS |
| **Web** | React, Vite, React Router, Axios, Leaflet e React-Leaflet, OpenStreetMap (mapas), Nominatim (busca de endereços) |
| **Mobile** | React Native, Expo (SDK 57), Expo Router, TypeScript, `react-native-maps`, Axios, Expo SecureStore, Expo Image Picker, Expo Location, EAS Build |

## Estrutura do repositório

```
CidaLink-Projeto/
├── backend/        API REST (Node.js + Express + MySQL)
│   ├── controller/
│   ├── databases/
│   ├── middleware/
│   ├── model/
│   ├── router/
│   ├── utils/
│   ├── database/schema.sql   script de criação do banco
│   └── server.js
├── web/  aplicação web (React + Vite)
├── mobile/           
│     ├── CidaLink-app/   aplicativo mobile (Expo / React Native)
├── LICENSE
└── README.md
```

## Pré-requisitos

- [Node.js](https://nodejs.org) 
- [Git](https://git-scm.com)
- [XAMPP](https://www.apachefriends.org) com o **MySQL** ligado (ou outro servidor MySQL/MariaDB)

Só para o mobile:

- Celular Android com **Depuração USB** ativada, e um cabo que transfira dados
- [Android Platform-Tools](https://developer.android.com/tools/releases/platform-tools) (traz o `adb`)
- Conta gratuita na [Expo](https://expo.dev) para gerar o build com o EAS

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/gakimr/Projeto-CidaLink.git
cd Projeto-CidaLink
```

### 2. Banco de dados

1. Abra o painel do XAMPP e inicie o **MySQL**.
2. Acesse o phpMyAdmin em `http://localhost/phpmyadmin`.
3. Na aba **SQL**, cole o conteúdo de `backend/database/schema.sql` e execute (ou use a aba **Importar**). Isso cria o banco `cidalink` com as tabelas `bairros`, `users` e `postagens`.

Os bairros não precisam ser cadastrados à mão: a tabela `bairros` é preenchida automaticamente conforme as ocorrências são registradas.

### 3. Backend

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env` (veja [Variáveis de ambiente](#variáveis-de-ambiente)) e inicie o servidor:

```bash
node server.js
```

O servidor sobe em `http://localhost:3000`. As fotos enviadas ficam em `backend/uploads/`, pasta criada automaticamente.

### 4. Web

Com o backend rodando, em outro terminal:

```bash
cd Web
npm install
npm run dev
```

Acesse o endereço mostrado no terminal (normalmente `http://localhost:5173`). A web conversa com a API em `http://localhost:3000`, endereço configurado em `Web/src/services/api.js`.

### 5. Mobile

O aplicativo usa módulos nativos (mapa, armazenamento seguro, câmera e localização), por isso roda num **development build** e não no Expo Go.

```bash
cd CidaLink-app
npm install
```

Crie o arquivo `CidaLink-app/.env`:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**Gerar e instalar o build (só na primeira vez, ou quando mudar algum módulo nativo):**

```bash
npx eas-cli login
npx eas-cli build --profile development --platform android
```

Ao final, baixe o `.apk` pelo link ou QR code que o EAS mostrar e instale no celular.

**Rodar o app no dia a dia:**

1. Conecte o celular por cabo USB e confira que ele aparece:
   ```bash
   adb devices
   ```
2. Ligue as portas do celular ao computador (repita sempre que reconectar o cabo):
   ```bash
   adb reverse tcp:8081 tcp:8081
   adb reverse tcp:3000 tcp:3000
   ```
   A porta 8081 é a do servidor do Expo e a 3000 é a do backend. Por causa dela o app usa `localhost` como endereço da API.
3. Com o backend rodando, inicie o Expo:
   ```bash
   npx expo start --dev-client -c
   ```
4. Abra o aplicativo CidaLink no celular.

## Variáveis de ambiente

Arquivos `.env` não são versionados. Cada pessoa cria o seu.

**`backend/.env`**

```
PORT=3000

DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=cidalink

JWT_SECRET=troque-por-uma-frase-longa-e-aleatoria
JWT_EXPIRES_IN=1d

ADMIN_CODE=defina-o-codigo-de-administrador
```

| Variável | Para que serve |
| --- | --- |
| `PORT` | Porta da API |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexão com o MySQL (no XAMPP, o usuário padrão é `root` e a senha é vazia) |
| `JWT_SECRET` | Segredo usado para assinar os tokens de login |
| `JWT_EXPIRES_IN` | Validade do token (por exemplo `1d`) |
| `ADMIN_CODE` | Código exigido para criar uma conta de administrador |

**`CidaLink-app/.env`**

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Endpoints da API

Todas as rotas abaixo, exceto `/login` e `/cadastro`, exigem o cabeçalho `Authorization: Bearer <token>`.

| Método | Rota | Descrição | Acesso |
| --- | --- | --- | --- |
| POST | `/login` | Entrar com e-mail e senha | Público |
| POST | `/cadastro` | Criar conta (administrador exige `codigoAdmin`) | Público |
| PUT | `/perfil` | Atualizar dados do perfil | Logado |
| PUT | `/perfil/foto` | Enviar foto de perfil (campo `foto`) | Logado |
| GET | `/postagens` | Listar ocorrências (filtro opcional `?status=`) | Logado |
| GET | `/postagens/minhas` | Listar as ocorrências do usuário | Logado |
| GET | `/postagens/:id` | Detalhes de uma ocorrência | Logado |
| POST | `/postagens` | Criar ocorrência (multipart, campo `foto`) | Logado |
| PUT | `/postagens/:id/status` | Alterar status e responder | Administrador |
| DELETE | `/postagens/:id` | Excluir ocorrência | Dono ou administrador |
| GET | `/bairros` | Listar bairros já cadastrados | Logado |

Valores aceitos: categorias `buraco`, `iluminacao`, `lixo`, `saneamento`, `outro`; status `pendente`, `andamento`, `resolvida`.

## Primeiro acesso e conta de administrador

- **Cidadão:** use a tela de cadastro, na web ou no app.
- **Administrador:** acesse `/cadastro/administrador` na web e informe, além dos dados normais, o valor definido em `ADMIN_CODE`. O login de administrador fica em `/loginadm`.


## Status do projeto

**Web**

- [x] Cadastro e login de cidadão e administrador
- [x] Feed, mapa, criar ocorrência, perfil e página da ocorrência ligados ao banco
- [x] Resposta e atualização de status pelo administrador
- [ ] Notificações
- [ ] Bate-papo
- [ ] Apoio (votos) nas ocorrências
- [ ] Editar uma ocorrência já registrada
- [ ] Histórico de ações do administrador

**Mobile**

- [x] Login, cadastro, sessão persistente e logout
- [ ] Feed com dados do banco
- [ ] Mapa com as ocorrências
- [ ] Criar ocorrência com foto e localização
- [ ] Perfil

## Equipe

- Gabriela Kimura
- Eduarda Ricardo
- Rafaela Freitas

## Licença

Distribuído sob a licença descrita no arquivo [LICENSE](LICENSE).
