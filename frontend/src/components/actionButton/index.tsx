import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { micOutline, stopOutline } from "ionicons/icons";
import { useRef, useState } from "react";

export interface RecodingResult {
    blob: Blob,
    url: string
}

interface ActionButtonProps {   
    afterNewRecording: (result: RecodingResult) => void
}

const ActionButton: React.FC<ActionButtonProps> = ({afterNewRecording}: ActionButtonProps) => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            afterNewRecording({
                blob,
                url: URL.createObjectURL(blob)
            })
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);

    }

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
        const stream = mediaRecorderRef.current?.stream;
        stream?.getTracks().forEach(track => track.stop());
    }

    return (
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
            {
                isRecording ?
                    <IonFabButton color="danger" onClick={stopRecording}>
                        <IonIcon icon={stopOutline} />
                    </IonFabButton>
                    :
                    <IonFabButton color="light" onClick={startRecording}>
                        <IonIcon icon={micOutline} />
                    </IonFabButton>
            }
        </IonFab>
    )
}

export default ActionButton;