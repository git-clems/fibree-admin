import { useEffect, useState } from 'react'
import { Link } from 'react-router';
import { collection, doc, getDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../auth/firebase';
import Loading from '../components/LoadingPage';
import Page404 from './404';

const Events = () => {
    const [events, setEvents] = useState()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fectData = async () => {
            setLoading(true)
            try {
                const response = await getDocs(collection(db, 'event'))
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                })).filter(e => !e.removed)
                setEvents(data)
            } catch (error) {
                console.log(error);
                setEvents(null)
            } finally {
                setLoading(false)
            }
        };
        fectData();
    }, [])

    if(loading) return <Loading/>
    if (!events) return null

    const Event = ({ eventId }) => {

        const [event, setFlashInfo] = useState()

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const snap = await getDoc(doc(db, 'event', eventId))
                    setFlashInfo({ _id: snap.id, ...snap.data() } || null);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchData();
        }, [eventId]);


        while (!event) {
            return (
                <div class="card m-3 w-[300px] border-1 border-gray-300 rounded-md bg-[white] hover:shadow-[0_0_15px_rgba(0,0,25,0.9)] transition-shadow duration-200 overflow-hidden" aria-hidden="true">
                    <div class="card-body">
                        <h5 class="card-title placeholder-glow">
                            <span class="placeholder col-6"></span>
                        </h5>
                        <p class="card-text placeholder-glow">
                            <span class="placeholder col-7"></span>
                            <span class="placeholder col-4"></span>
                            <span class="placeholder col-4"></span>
                            <span class="placeholder col-6"></span>
                            <span class="placeholder col-8"></span>
                        </p>
                    </div>
                </div>
            )
        }

        return (
            <>
                {event.displayed &&
                    <Link key={eventId} to={`/evenement/${eventId}`} className='m-2 max-[600px]:w-full w-[20vw] min-w-[270px] border-1 border-gray-300 rounded-md bg-white hover:shadow-[0_0_15px_rgba(0,0,25,0.9)] transition-shadow duration-200 overflow-hidden'>
                        {
                            event.image ?
                                <img src={event.image} alt="" className='rounded-t-md h-[200px] w-[100%] object-cover bg-black' /> :
                                <img src={'/bg/event-bg.jpg'} alt="" className='rounded-t-md h-[200px] w-[100%] object-contain' />
                        }
                        <div className='flex justify-center font-bold items-center pl-3 pr-3 bg-green-600 text-white'>{event.type}</div>
                        <div className='m-2 mt-0'>
                            <div className='mb-2 line-clamp-2'>{event.title}</div>
                            <div className='flex justify-between'>
                                {event.comingDate && <div className='text-xs font-bold text-white truncate bg-red-500 rounded p-1 '> <i className='fa-solid fa-calendar'></i> {Timestamp.fromDate(new Date(event?.comingDate)).toDate().toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} {event.comingTime && `à ${event.comingTime} GMT`}</div>}
                                {event.online && <div className={`text-white font-bold bg-blue-500 w-[max-content] ${event.comingDate && ""} text-xs p-1 rounded`}> <i class="fa-solid fa-video"></i> En ligne</div>}
                            </div>
                            {event.adress && <div className='mt-2 text-xs text-gray-500 truncate'> <i className='fa-solid fa-location-dot'></i> {event.adress} </div>}
                        </div>
                    </Link>}
            </>
        )
    }



    return (
        <div className='page'>
            <div className="m-2">
                <h2 className='ml-2'>Evènements</h2>
                <div className="flex-1 flex flex-wrap">
                    {events.sort((a,b)=> b.publishDate - a.publishDate).map((event) => (event.displayed && (<Event eventId={event._id}></Event>)))}
                </div>
            </div>
        </div>
    )
}

export default Events