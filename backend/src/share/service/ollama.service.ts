import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class OllamaService {
    private baseUrl: string

    constructor(private config: ConfigService) {
        this.baseUrl = this.config.get<string>('OLLAMA_API_PATH')
    }

    async summarize(text: string): Promise<string> {
        const prompt = `สรุปข้อความต่อไปนี้ให้สั้นกระชับ ตอบเฉพาะเนื้อหาสรุป:\n\n${text}`;

        const response = await axios.post(`${this.baseUrl}/generate`, {
            model: 'llama3',
            prompt: prompt,
            stream: false,
        });

        console.log(JSON.stringify(response.data))
        return response.data.response.trim();
    }
}