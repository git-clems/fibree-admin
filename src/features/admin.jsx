import { useEffect, useMemo, useRef, useState } from 'react'
import LayoutAdmin from '../components/layoutAdmin'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../auth/firebase'

const Admin = () => {
    const [search, setSearch] = useState('')
    const [messageNotOpend, setMessageNotOpend] = useState()
    const [suspended, setSuspended] = useState()
    const [joinNotAccepted, setJoinNotAccepted] = useState()
    const [partnerNotAccepted, setPartnerNotAccepted] = useState()

    const audioRef = useRef(null)
    const previousCountRef = useRef(null)

    useEffect(() => {
        audioRef.current = new Audio('/sounds/message_received.mp3')
    }, [])

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'contact'), (snap) => {
            const data = snap.docs.map((e) => ({
                _id: e.id,
                ...e.data()
            }))

            const dataFiltered = data.filter((e) => (!e.opened && !e.removed))
            const newCount = dataFiltered.length

            if (previousCountRef.current !== null && newCount > previousCountRef.current) {
                audioRef.current?.play().catch((error) => {
                    console.log('Lecture audio bloquée :', error)
                })
            }

            previousCountRef.current = newCount
            setMessageNotOpend(newCount)

            
        })
        
        return () => unsubscribe()
    }, [])
    
    // console.log(messageNotOpend);
    useEffect(() => {
        try {
            onSnapshot(collection(db, 'join'), snap => {
                const data = snap.docs.map(e => ({
                    _id: e.id,
                    ...e.data()
                }))
                const dataFilered = data.filter(e => !e.accepted)
                setJoinNotAccepted(dataFilered.length)
            })
        } catch (error) {
            console.log(error);
        }
    }, [])

    useEffect(() => {
        try {
            onSnapshot(collection(db, 'new-partner'), snap => {
                const data = snap.docs.map(e => ({
                    _id: e.id,
                    ...e.data()
                }))
                const dataFilered = data.filter(e => !e.accepted)
                setPartnerNotAccepted(dataFilered.length)
            })
        } catch (error) {
            console.log(error);
        }
    }, [])

    useEffect(() => {
        try {
            onSnapshot(collection(db, 'member'), snap => {
                const data = snap.docs.map(e => ({
                    _id: e.id,
                    ...e.data()
                }))
                setSuspended(data.filter(e => e.suspended).length)
            })
        } catch (error) {
            console.log(error);
        }
    }, [])

    const blocks = [
        { link: '/admin/affiche', name: 'Affiches en carrousel', bg_color: 'rgb(0, 0, 0)', text_color: 'white' },
        { link: '/admin/evenement', name: 'Evènements', bg_color: 'rgba(255,0,0,0.6)', text_color: 'white' },
        { link: '/admin/actualite', name: 'Actualités', bg_color: 'rgba(233, 209, 70, 0.95)' },
        { link: '/admin/mission', name: 'Missions', bg_color: 'rgba(0, 64, 255, 0.6)', text_color: 'white' },
        { link: '/admin/chiffre', name: 'Statistiques' },
        { link: '/admin/nouveau-membre', name: "Demandes d'adhésion", bg_color: "rgba(78, 249, 255, 0.89)", badge: joinNotAccepted },
        { link: '/admin/membre', name: 'Membres', bg_color: "rgba(255, 220, 78, 0.89)" },
        { link: '/admin/suspendu', name: 'Membres suspendus', bg_color: "rgb(165, 138, 195)", text_color: 'white', badge: suspended },
        { link: '/admin/nouveau-partenaire', name: 'Demandes de partenariat', text_color: 'white', bg_color: "rgba(237, 169, 67, 0.89)", badge: partnerNotAccepted },
        { link: '/admin/partenaire', name: 'Partenaires', bg_color: 'rgb(121, 173, 203)', text_color: 'white' },
        { link: '/admin/messagerie', name: 'Messageries', bg_color: "rgb(164, 199, 246)", badge: messageNotOpend },
        { link: '/admin/a-propos', name: 'A propos', bg_color: "rgba(40, 152, 217, 0.76)", text_color: 'white' },
        { link: '/admin/equipe', name: 'Equipe', bg_color: "rgba(187, 40, 217, 0.76)", text_color: 'white' },
        { link: '/admin/projet', name: 'Projets à venir', bg_color: "rgba(182, 217, 40, 0.76)" },
    ]

    const normalizedSearch = search.trim().toLowerCase()

    const filteredBlocks = useMemo(() => {
        if (!normalizedSearch) return blocks

        return [...blocks]
            .filter((block) =>
                block.name.toLowerCase().includes(normalizedSearch)
            )
            .sort((a, b) => {
                const aStarts = a.name.toLowerCase().startsWith(normalizedSearch)
                const bStarts = b.name.toLowerCase().startsWith(normalizedSearch)

                if (aStarts && !bStarts) return -1
                if (!aStarts && bStarts) return 1

                return a.name.localeCompare(b.name)
            })
    }, [search, blocks])

    return (
        <div className="page">
            <form className="flex flex-wrap max-w-[1000px] items-center justify-center max-[800px]:m-2 min-[800px]:m-5" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-1 border-2 border-gray-300 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-blue-300 focus-within:border-white duration-50">
                    <input type="search" placeholder="Rechercher un bloc" value={search} onChange={(e) => setSearch(e.target.value)} className=" border-l-none outline-none rounded-l-full h-[40px] pl-2 flex-1" />
                    <div className="text-gray-400 pr-5 pl-5 border-gray-300 flex justify-center items-center"><i class="fa-solid fa-magnifying-glass"></i></div>
                </div>
            </form>

            <div className="flex flex-wrap max-[800px]:justify-center">
                {
                    filteredBlocks.length > 0 ?
                        filteredBlocks.map((block) => (
                            <LayoutAdmin
                                key={block.link}
                                link={block.link}
                                name={block.name}
                                bg_color={block.bg_color}
                                text_color={block.text_color}
                                badge={block.badge}
                            />))
                        :<p className="m-5 text-gray-500">Aucun bloc trouvé.</p>}
            </div>
        </div>
    )
}

export default Admin