# Servidor NewJazz

Servidor WebSocket em Node.js para salas de chat / presença do New Jazz.

## Requisitos

- Node.js 18+
- npm

## Instalação

```bash
npm install
```

## Execução

```bash
npm start
```

O servidor vai iniciar na porta configurada pela variável de ambiente `PORT` ou, por padrão, na porta 8080.

## Endpoints / protocolo

Este servidor usa WebSocket (`ws`) e aceita mensagens em JSON. Exemplo de eventos:

- `join` → entra em uma sala
- `presence` → envia patch de presença
- `emit` → envia evento para todos da sala

## Deploy no Render

Configure o serviço com:

- Runtime: Node
- Build Command: `npm install`
- Start Command: `node server.js`

## Observação

O projeto foi migrado do Python para Node.js. Se houver arquivos antigos como `app.py` e `requirements.txt`, remova-os do repositório para evitar que o Render tente rodar a versão errada.
