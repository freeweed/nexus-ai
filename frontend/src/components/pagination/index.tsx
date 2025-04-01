import { IonButton, IonButtons, IonIcon } from "@ionic/react"
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import { useEffect, useState } from "react";

export interface IPagination{
    total: number,
    page: number,
    nextPage: number | null,
    prevPage: number | null,
    lastPage: number,
    onSelectPage: (page: number | null) => void
}

const Pagination: React.FC<IPagination> = ({total = 0, page = 1, nextPage, prevPage, lastPage, onSelectPage}: IPagination) => {
    const delta = 2
    const [pageRange, setPageRange] = useState<any[]>([])
    
    useEffect(() => {
        const left = page - delta
        const right = page + delta + 1
        const range = []
        const rangeWithDots = []
        let l = null
        for (let i = 1; i <= lastPage; i++) {
            if (i == 1 || i == lastPage || i >= left && i < right) {
                range.push(i);
            }
        }
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        setPageRange(rangeWithDots)
    }, [total, page, nextPage, prevPage, lastPage])

    const handleSelect = (selectPage: number | string) => {
        if(selectPage === '...'){
            onSelectPage(+page + 1)
        }else{
            onSelectPage(+selectPage)
        }
    }

    return (
        <IonButtons className="page">
            <IonButton onClick={() => {onSelectPage(prevPage)}} disabled={prevPage === null}>
                <IonIcon icon={chevronBackOutline}></IonIcon>
            </IonButton>
            {
                pageRange.map((row, index) => {
                    return (
                        <IonButton 
                            key={index} 
                            className="m-0" 
                            color={ (+row === +page) ? "primary" : ""} 
                            fill={ (+row === +page) ? "solid" : "clear"}
                            onClick={() => {handleSelect(row)}}
                        >
                            <span>{row}</span>
                        </IonButton>
                    )
                })
            }
            <IonButton  onClick={() => {onSelectPage(nextPage)}} disabled={nextPage === null}>
                <IonIcon icon={chevronForwardOutline}></IonIcon>
            </IonButton>
        </IonButtons>
    )
}

export default Pagination