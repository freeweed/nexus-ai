import { useEffect, useState } from "react";
import { MainLayout, TranscriptionRow } from "../../../components";
import { INote } from "../../../interface/note.interface";
import { useParams } from 'react-router-dom';
import { HttpMethod, httpRequest } from "../../../service/http-request";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonContent, IonIcon, IonItem, IonLabel, IonList, IonRow, IonSpinner, useIonRouter, useIonViewDidEnter } from "@ionic/react";
import Output from "editorjs-react-renderer";
import { alertOutline } from "ionicons/icons";

const MeetingNoteDetail = () => {
    const router = useIonRouter()
    const { id } = useParams<{ id: string }>();
    const [note, setNote] = useState<INote | null>(null)
    const [error, setError] = useState<string>("")

    const getNote = async () => {
        try {
            const result: INote = await httpRequest(HttpMethod.GET, `/note/${id}`)
            console.log('result: ' + JSON.stringify(result))
            setNote(result)
        } catch (err: any) {
            switch (err.status) {
                case 404:
                    setError("Not found your note")
                    break;
                default:
                    setError("Someting went wrong please try again later")
                    break;
            }
        }
    }

    const goBack = () => {
        router.push('/note', 'root', 'replace')
    }

    useIonViewDidEnter(() => {
        getNote()
    })

    return (
        <MainLayout title={note?.title || "Note Detial"}>
            {
                error === "" ?
                    <IonRow>
                        <IonCol size="8">
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardSubtitle>
                                        Note
                                    </IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    {
                                        note?.content &&
                                        <Output data={
                                            {
                                                time: 1564767102436,
                                                version: "2.14.0",
                                                blocks: note?.content
                                            }
                                        } />
                                    }

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
                                            note?.transcriptions?.length ?
                                                note?.transcriptions?.map((row, index) => {
                                                    return (
                                                        <TranscriptionRow
                                                            key={index}
                                                            title={`${note?.title} ${index + 1}`}
                                                            url={row.filepath}
                                                            transcription={row.transcription}
                                                        />
                                                    )
                                                })
                                                :
                                                <IonItem>
                                                    <IonLabel>This note no have transcription</IonLabel>
                                                </IonItem>
                                        }
                                    </IonList>
                                </IonCardContent>
                            </IonCard>
                            {
                                note?.summary &&
                                <IonCard>
                                    <IonCardContent>
                                        <IonCardSubtitle>
                                            Summary
                                        </IonCardSubtitle>
                                    </IonCardContent>
                                    <IonCardContent>
                                        {note?.summary}
                                    </IonCardContent>
                                </IonCard>
                            }
                        </IonCol>
                    </IonRow>
                    :
                    <IonCard style={{ "width": '100%' }} mode="md" color="danger">
                        <IonCardContent>
                            <IonItem lines="none" color="danger">
                                <IonIcon icon={alertOutline} />
                                {error}
                                <IonButton onClick={goBack} slot="end" fill="clear" color="light">
                                    Go Back
                                </IonButton>
                            </IonItem>
                        </IonCardContent>
                    </IonCard>
            }

        </MainLayout>
    )
}

export default MeetingNoteDetail;