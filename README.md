# nexus-ai
This is example code for implementing service with AI model llama and whisper

## Necessary environment
- Docker 
- Nodejs

## How to start
1. create .env in backend folder following bellow env
1. `docker compose up`
2. Open browser to website `http://localhost:8100`

## Env
example env feel free to replace with your env
```
NODE_ENV=local
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_NAME=app_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
ENCRYPTION_KEY=r4X0H9ipSi3kYafEYKlBK0RQCaQH4HcM
WHISPER_API_PATH=http://whisper:5002/transcribe
OLLAMA_API_PATH=http://ollama:11434/api
GENERATIVE_MODEL=llama3
BASE_URL=http://localhost:3000
```