import { useEffect, useRef, useState } from "react";
import { MainLayout, Pagination } from "../../../components";
import { IonCard, IonCol, IonGrid, IonRow, IonSearchbar, useIonRouter, useIonViewDidEnter } from "@ionic/react";
import { HttpMethod, httpRequest } from "../../../service/http-request";
import { INote } from "../../../interface/note.interface";

interface INotes {
    items: INote[],
    total: number,
    nextPage: number,
    prevPage: number,
    lastPage: number,
    page: number
}

const MeetingNoteList = () => {
    const router = useIonRouter()
    const isFirstLoad = useRef(true);
    const [page, setPage] = useState<number | null>(1)
    const [search, setSearch] = useState<string>("")
    const [notes, setNotes] = useState<INotes>({
        items: [],
        total: 0,
        nextPage: 0,
        prevPage: 0,
        lastPage: 1,
        page: 1,
    })

    const onSearch = (e: CustomEvent) => {
        const value = e.detail.value;
        setSearch(value);
    }

    const getNote = async () => {
        const params = { page, search }
        const result = await httpRequest(HttpMethod.GET, '/note', null, params)
        setNotes(result)
    }

    const goDetail = (id: number) => {
        router.push(`/note/${id}`)
    }

    useIonViewDidEnter(() => {
        if (isFirstLoad.current) {
            getNote()
            isFirstLoad.current = false;
        }
    })

    useEffect(() => {
        if (!isFirstLoad.current) {
            getNote()
        }
    }, [page])

    useEffect(() => {
        if (!isFirstLoad.current) {
            const timeout = setTimeout(() => {
                getNote();
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [search]);

    return (
        <MainLayout
            title="Meeting Note List"
        >
            <IonCard>
                <IonSearchbar placeholder="Search for title or content" value={search} onIonInput={onSearch} />
                <IonGrid className="table">
                    <IonRow className="header">
                        <IonCol size="1">Id</IonCol>
                        <IonCol size="8">Title</IonCol>
                        <IonCol size="3">Created</IonCol>
                    </IonRow>
                    {
                        notes.items.length === 0 ?
                            <IonCol size="auto">No have note</IonCol>
                            :
                            notes.items.map((row, index) => {
                                return (
                                    <IonRow key={index} onClick={() => goDetail(row.id)}>
                                        <IonCol size="1">{row.id}</IonCol>
                                        <IonCol size="8">{row.title}</IonCol>
                                        <IonCol size="3">{row.created}</IonCol>
                                    </IonRow>
                                )
                            })
                    }
                    <IonRow className="ion-justify-content-end ion-align-items-center">
                        <IonCol size="auto">
                            <Pagination
                                total={notes.total}
                                page={notes.page}
                                nextPage={notes.nextPage !== 0 ? notes.nextPage : null}
                                prevPage={notes.prevPage !== 0 ? notes.prevPage : null}
                                lastPage={notes.lastPage}
                                onSelectPage={(selectPage) => { setPage(selectPage) }}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCard>


        </MainLayout>
    )
}

export default MeetingNoteList;