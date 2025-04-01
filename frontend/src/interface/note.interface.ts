export interface INote{
    id: number,
    title: string,
    content: Array<Record<string, any>>,
    summary?: string,
    created: string,
    updated: string,
    transcriptions?: ITranscription[]
}

export interface ITranscription {
    id: number,
    filename: string,
    filepath: string,
    transcription: string,
    created: string,
    updated: string,
    noteId: number
}