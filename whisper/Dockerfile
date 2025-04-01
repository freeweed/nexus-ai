FROM python:3.10-slim

RUN apt-get update && apt-get install -y ffmpeg git && \
    pip install --no-cache-dir faster-whisper uvicorn fastapi pydub python-multipart

WORKDIR /app

COPY app.py .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5002"]
