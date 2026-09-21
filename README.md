# Magazord Agenda

Aplicação fullstack de agenda com cadastro de pessoas e seus contatos (telefone e e-mail), desenvolvida como teste técnico para a vaga fullstack da Magazord.

O enunciado completo, com requisitos funcionais, não funcionais e regras de negócio, está em [ESPECIFICACAO.md](./ESPECIFICACAO.md).

## Stack

| Camada         | Tecnologias                                                                      |
| -------------- | -------------------------------------------------------------------------------- |
| Backend        | Node.js, TypeScript, Express, TypeORM, PostgreSQL 18, Zod, JWT                   |
| Frontend       | React, Vite, TypeScript, Tailwind CSS, shadcn/ui (Base UI), React Hook Form, Zod |
| Testes         | Jest, Supertest                                                                  |
| Infraestrutura | Docker, Docker Compose                                                           |

## Pré-requisitos

- Docker e Docker Compose
- Node.js 20 ou superior (necessário apenas para rodar os testes fora do container)

## Como rodar

Na raiz do projeto:

```bash
docker compose up --build
```

Ou, pelo atalho equivalente:

```bash
npm run dev
```

O Compose sobe três serviços. As migrations rodam automaticamente na inicialização do backend.

| Serviço       | Endereço                                                                |
| ------------- | ----------------------------------------------------------------------- |
| Frontend      | http://localhost:5173                                                   |
| Backend (API) | http://localhost:3000                                                   |
| PostgreSQL    | localhost:5454 (usuário `postgres`, senha `postgres`, banco `magazord`) |

Para parar:

```bash
docker compose down
```

Para parar e apagar os dados do banco:

```bash
docker compose down -v
```

## Acesso

| Usuário | Senha      |
| ------- | ---------- |
| `admin` | `senha123` |

As credenciais são definidas pelas variáveis `AUTH_USER` e `AUTH_PASS` no `compose.yaml`.

## Testes

Os testes ficam no backend. Existem testes unitários (validadores e regras de negócio das Services, sem banco) e de integração (rotas HTTP contra o PostgreSQL real).

```bash
docker compose up -d db
npm --prefix backend install
npm test
```

Checagem de tipos do backend:

```bash
npm --prefix backend run typecheck
```

> **Atenção:** os testes de integração limpam as tabelas (`TRUNCATE`) antes de cada caso e usam o mesmo banco do ambiente de desenvolvimento. Rodar `npm test` apaga os dados cadastrados pela interface.

## Regras de negócio implementadas

Além do enunciado, a aplicação valida:

- **Nome:** mínimo de 4 caracteres, apenas letras (com acento) e espaços, máximo de 50.
- **CPF:** validação completa dos dígitos verificadores, único no sistema (inclusive na edição). É armazenado apenas com dígitos.
- **Contato:** a descrição é validada conforme o tipo. E-mail precisa de formato válido; telefone precisa de DDD e número (10 ou 11 dígitos).
- **Limite:** no máximo 5 contatos por tipo para cada pessoa, com contagem separada (5 telefones e 5 e-mails são permitidos).
- **Cadastro com contatos:** a pessoa pode ser criada já com contatos. Tudo é gravado numa única transação: se qualquer contato for inválido, nada é salvo.
- **Vínculo obrigatório:** todo contato pertence a uma pessoa (`idPessoa` obrigatório). Excluir a pessoa exclui os contatos em cascata.
- **Edição de contato:** apenas a descrição pode ser alterada. Pessoa e tipo são fixos após a criação.

No banco, `contato.tipo` segue o enunciado como `boolean`: `true` para e-mail e `false` para telefone.

## API

Todas as rotas, exceto o login, exigem o cabeçalho `Authorization: Bearer <token>`.

| Método | Rota                         | Corpo                           | Descrição                                        |
| ------ | ---------------------------- | ------------------------------- | ------------------------------------------------ |
| POST   | `/auth/login`                | `{ usuario, senha }`            | Retorna `{ token }`                              |
| GET    | `/pessoas`                   |                                 | Lista pessoas com seus contatos. Aceita `?nome=` |
| POST   | `/pessoas`                   | `{ nome, cpf, contatos? }`      | Cria pessoa, opcionalmente com contatos          |
| PUT    | `/pessoas/:id`               | `{ nome, cpf }`                 | Atualiza pessoa                                  |
| DELETE | `/pessoas/:id`               |                                 | Exclui pessoa e seus contatos                    |
| GET    | `/contatos`                  |                                 | Lista contatos com a pessoa vinculada            |
| GET    | `/contatos/pessoa/:idPessoa` |                                 | Lista contatos de uma pessoa                     |
| POST   | `/contatos`                  | `{ idPessoa, tipo, descricao }` | Cria contato                                     |
| PUT    | `/contatos/:id`              | `{ descricao }`                 | Atualiza a descrição                             |
| DELETE | `/contatos/:id`              |                                 | Exclui contato                                   |

Códigos de erro:

| Status | Quando                                                  |
| ------ | ------------------------------------------------------- |
| 400    | Corpo com formato inválido ou id inválido na URL        |
| 401    | Token ausente, inválido ou expirado                     |
| 404    | Pessoa ou contato não encontrado                        |
| 409    | CPF já cadastrado                                       |
| 422    | Regra de negócio violada (nome, CPF, contato ou limite) |

## Arquitetura

### Backend

```
Controller → Service → Repository → TypeORM → PostgreSQL
```

- **Controller:** valida o formato da entrada com Zod e traduz exceções nomeadas em status HTTP.
- **Service:** concentra as regras de negócio. Recebe o Repository por injeção de dependência, o que permite testar sem banco.
- **Repository:** apenas operações de banco, sem decisão.

A separação entre as duas validações é intencional: o Zod verifica o formato (é texto? os campos existem?) e a Service verifica a regra (o CPF é válido? já existe? o limite foi atingido?).

### Frontend

Organizado por funcionalidade, não por tipo de arquivo:

```
frontend/src/
├── auth/            login, sessão e rota protegida
├── pessoa/          tela, formulário, detalhe, validação e service
├── contato/         tela, formulário, validação e service
├── shared/          layout, tabela, cliente HTTP e componentes reaproveitados
└── components/ui/   componentes do shadcn/ui
```

Os schemas Zod do frontend espelham as regras do backend, para dar resposta imediata no formulário. A validação que garante a integridade continua no backend.

O frontend chama a API por `/api`, que o servidor do Vite redireciona para o backend. Isso evita configuração de CORS.

## Limitações conhecidas

- **Usuário único:** a autenticação usa um usuário fixo definido por variável de ambiente. Não há cadastro de usuários.
- **Token no navegador:** o JWT fica no `localStorage`.
- **Segredos no Compose:** senhas e a chave do JWT estão em texto no `compose.yaml` para simplificar a execução do teste. Em produção iriam para variáveis de ambiente fora do repositório.
- **Containers em modo desenvolvimento:** backend e frontend rodam com recarregamento automático, não com build de produção.
- **Banco compartilhado nos testes:** ver o aviso na seção de testes.
