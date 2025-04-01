from fastapi import FastAPI, UploadFile, File
from faster_whisper import WhisperModel
import os

app = FastAPI()
model = WhisperModel("base", compute_type="int8")

@app.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    audio_path = f"/tmp/{file.filename}"
    with open(audio_path, "wb") as f:
        f.write(await file.read())

    segments, info = model.transcribe(audio_path)
    result = "".join([seg.text for seg in segments])
    os.remove(audio_path)
    return {"text": result}
