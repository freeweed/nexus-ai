import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonIcon, IonInput, IonItem, IonLabel, IonList, IonRow, IonSpinner, IonToast, useIonRouter } from "@ionic/react"
import MainLayout from "../../../components/mainLayout"

import { useEffect, useState } from "react"
import { ActionButton, Editor, TranscriptionRow } from "../../../components"
import { RecodingResult } from "../../../components/actionButton"
import { alertOutline, checkmarkOutline, micOutline, saveOutline } from "ionicons/icons"
import { HttpMethod, httpRequest } from "../../../service/http-request"
import { useHistory } from "react-router"

interface Transcription extends RecodingResult {
    id: number
    transcription?: string
    title: string
}

interface CustomToast {
    isOpen: boolean
    message: string
    color: string
    icon?: string
}

const CreateMeetingNote: React.FC = () => {
    const hisotry = useHistory();
    const [title, setTitle] = useState<string | null>(null)
    const [content, setContent] = useState<Record<string, any>>({})
    const [tracks, setTracks] = useState<Transcription[]>([])
    const [summary, setSummary] = useState<string>("")
    const [isUploading, setIsUploading] = useState(false)
    const [customToast, setCustomToast] = useState<CustomToast>({
        isOpen: false,
        message: "",
        color: "light"
    })

    function decodeHtml(html: string): string {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }


    const populateTitle = () => {
        for (let i = 0; i < content.length; i++) {
            const block = content[i]
            if (block.data.text) {
                setTitle(decodeHtml(block.data.text))
                break
            }
        }
    }

    const handleAfterRecording = async (result: RecodingResult) => {
        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('file', result.blob)
            const trascription = await httpRequest(
                HttpMethod.POST,
                `/transcription/upload`,
                formData,
                null,
                { 'Content-Type': 'multipart/form-data' }
            )

            setTracks([
                ...tracks,
                {
                    title: `Transcription ${tracks.length + 1}`,
                    ...result,
                    ...trascription
                }
            ])
            setSummary("")
            setCustomToast({
                isOpen: true,
                message: 'Generate trascript success.',
                color: 'success',
                icon: checkmarkOutline
            })
        } catch (err) {
            setCustomToast({
                isOpen: true,
                message: 'Error while generating trascript.',
                color: 'danger',
                icon: alertOutline
            })
            console.log(JSON.stringify(err))
        } finally {
            setIsUploading(false)
        }

    }

    const summarize = async () => {
        try {
            const result = await httpRequest(
                HttpMethod.POST,
                `/transcription/summarize`,
                { text: tracks.map(row => row.transcription).join("") }
            )
            setSummary(result)
        } catch (err) {
            setCustomToast({
                isOpen: true,
                message: 'Error while summarize trascript.',
                color: 'danger',
                icon: alertOutline
            })
        }
    }

    const save = async () => {
        try {
            await httpRequest(
                HttpMethod.POST,
                `/note`,
                {
                    title: title ? title : "Meeting note",
                    content,
                    summary,
                    transcriptionIds: tracks.map(row => row.id)
                }
            )
            hisotry.replace('/note')
            setCustomToast({
                isOpen: true,
                message: 'Create note success',
                color: 'success',
                icon: checkmarkOutline
            })
        } catch (err) {
            setCustomToast({
                isOpen: true,
                message: 'Error while create note',
                color: 'danger',
                icon: alertOutline
            })
        }

    }

    useEffect(() => {
        if (Object.keys(content).length > 0) {
            populateTitle()
        }
    }, [content])

    useEffect(() => {
        if (tracks.length > 0) {
            summarize()
        }
    }, [tracks])

    return (
        <MainLayout title={title ? title : "Create Meeting Note"} translucent={false} btns={[{
            title: "Save",
            icon: saveOutline,
            color: 'dark',
            disabled: Object.keys(content).length === 0,
            onClick: save
        }]}>
            <IonRow>
                <IonCol size="8" >
                    <IonCard style={{ "height": "80vh" }}>
                        <IonCardHeader>
                            <IonCardSubtitle>
                                Note
                            </IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <Editor onContent={(content) => setContent(content)} />
                        </IonCardContent>
                    </IonCard>
                </IonCol>
                <IonCol size="4">
                    <IonCard>
                        <IonCardHeader>
                            <IonCardSubtitle>
                                Transcription
                            </IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonList lines="none">
                                {
                                    tracks.length > 0 ?
                                        tracks.map((track, index) => {
                                            return (
                                                <TranscriptionRow
                                                    key={index}
                                                    title={track.title}
                                                    url={track.url}
                                                    transcription={track.transcription}
                                                />
                                            )
                                        }) :
                                        <IonItem>
                                            <IonLabel>Press <IonIcon icon={micOutline} /> to start record</IonLabel>
                                        </IonItem>
                                }
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                    {
                        tracks.length > 0 &&
                        <IonCard>
                            <IonCardContent>
                                <IonCardSubtitle>
                                    Summary
                                </IonCardSubtitle>
                            </IonCardContent>
                            {
                                summary !== "" ?
                                    <IonCardContent>
                                        {summary}
                                    </IonCardContent>
                                    :
                                    <IonCardContent>
                                        <IonSpinner></IonSpinner>
                                        Summarizing...
                                    </IonCardContent>
                            }

                        </IonCard>
                    }
                </IonCol>
            </IonRow>
            <ActionButton afterNewRecording={handleAfterRecording} />
            <IonToast
                isOpen={isUploading}
                message="Generating transcript..."
                position="top"
            ></IonToast>
            <IonToast
                isOpen={customToast.isOpen}
                message={customToast.message}
                color={customToast.color}
                icon={customToast.icon}
                position="top"
                onDidDismiss={() => setCustomToast({
                    ...customToast,
                    isOpen: false
                })}
                duration={3000}
            ></IonToast>
        </MainLayout>
    )
}

export default CreateMeetingNote;