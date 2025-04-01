# nexus-ai
This is example code for implementing service with AI model llama and whisper

## Architecture
![Untitled Diagram (1)](https://github.com/user-attachments/assets/e5b9ed5e-d7e6-41ec-b0c9-1f1b3e2f4cea)

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

## Potential improvements
1. Add authentication
2. Using better model for transcription
3. Enchant prompt and result handling

## Document
https://documenter.getpostman.com/view/18215304/2sB2cRDjyX/


