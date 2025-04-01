import { IonButton, IonIcon, IonItem, IonLabel } from "@ionic/react"
import { chevronDown, chevronUp, playOutline, stopOutline } from "ionicons/icons"
import { useRef, useState } from "react"
import { AudioPlayer, AudioPlayerHandle } from "../audioPlayer"

interface TranscriptionRowProps {
    title: string
    url: string
    transcription?: string
}

const TranscriptionRow: React.FC<TranscriptionRowProps> = ({ title, url, transcription }: TranscriptionRowProps) => {
    const playerRef = useRef<AudioPlayerHandle>(null)
    const [isPlay, setIsPlay] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const onPlay = () => {
        setIsPlay(true)
        playerRef.current?.play()
    }

    const onStop = () => {
        setIsPlay(false)
        playerRef.current?.stop()
    }

    return (
        <span>
            <IonItem>
                <IonButton slot="start" fill="clear" color={"dark"} size="large" onClick={() => setIsOpen(!isOpen)}>
                    <IonIcon aria-hidden="true" icon={isOpen ? chevronUp : chevronDown} slot="icon-only"></IonIcon>
                </IonButton>

                <IonLabel>{title}</IonLabel>
                {
                    !isPlay ?
                        <IonButton slot="end" fill="clear" color={"dark"} size="large" onClick={onPlay}>
                            <IonIcon aria-hidden="true" icon={playOutline} slot="icon-only"></IonIcon>
                        </IonButton>
                        :
                        <IonButton slot="end" fill="clear" color={"dark"} size="large" onClick={onStop}>
                            <IonIcon aria-hidden="true" icon={stopOutline} slot="icon-only"></IonIcon>
                        </IonButton>
                }
            </IonItem>
            {
                isOpen &&
                <IonItem lines="full">
                    <IonLabel>
                        {transcription}    
                    </IonLabel>
                </IonItem>
            }
            <AudioPlayer audioURL={url} ref={playerRef}/>
        </span>
    )
}

export default TranscriptionRow