import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";

interface BtnProps {
    title: string
    icon?: string
    color?: string
    disabled?: boolean
    onClick: () => void
}

interface MainLayoutProps {
    title: string
    children: React.ReactNode
    translucent?: boolean
    btns?: BtnProps[]
}

const MainLayout: React.FC<MainLayoutProps> = ({ title, children, translucent = true, btns }: MainLayoutProps) => {
    return (
        <IonPage>
            <IonHeader translucent={translucent}>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>{title}</IonTitle>
                    <IonButtons slot="end">
                        {
                            btns?.map((btn, index) => (
                                <IonButton key={index} color={btn.color} onClick={btn.onClick} fill="solid" disabled={btn.disabled}>
                                    <IonIcon slot={!btn.title ? "icon-only" : "start"} icon={btn.icon} />
                                    {btn.title}
                                </IonButton>
                            ))
                        }
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                {
                    translucent &&
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">{title}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                }

                {children}
            </IonContent>
        </IonPage>
    );
}

export default MainLayout;