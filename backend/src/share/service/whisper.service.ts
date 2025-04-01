// whisper.service.ts
import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs'
import * as FormData from 'form-data'

@Injectable()
export class WhisperService {
  constructor(private config: ConfigService){}

  async transcribe(filePath: string): Promise<string> {
    const form = new FormData()
    form.append('file', fs.createReadStream(filePath))

    const response = await axios.post(this.config.get<string>('WHISPER_API_PATH'), form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    })

    return response.data?.text || 'No transcription'
  }
}
