# Servidor NewJazz

Este é um servidor web em Python para o projeto `servidor-newjazz`.

## Requisitos

- Python 3.10+
- pip

## Instalação

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# ou
# .venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

## Executando

```bash
python app.py
```

A aplicação será iniciada em:

- http://localhost:5000/
- http://localhost:5000/health

## Endpoints

- `/` — mensagem inicial do servidor
- `/health` — verificação de saúde da API
