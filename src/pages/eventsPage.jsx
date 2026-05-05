import { useEffect, useState } from 'react'
import { Link } from 'react-router';
import { collection, doc, getDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../auth/firebase';
import Loading from '../components/LoadingPage';
import Page404 from './404';
import { PublishTime } from '../features/admin';

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
                })).filter(e => !e.removed && e.displayed)
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

    if (loading) return <Loading />
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


        if (!event) {
            return (
                <div class="card m-3 w-[300px] border-1 border-gray-300 rounded-md bg-[white]overflow-hidden" aria-hidden="true">
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
            <Link key={eventId} to={`/evenement/${eventId}`} className='m-2 max-[600px]:w-full w-[20vw] min-w-[270px] border-1 border-gray-300 rounded-md bg-white hover:shadow-[0_0_15px_rgba(0,0,25,0.9)] transition-shadow duration-200 overflow-hidden'>
                <div className='bg-sky-700 text-white text-center text-xs position-absolute shadow-[0_1px_5px_rgba(0,0,25,0.9)] p-2 rounded-tl'>Mise en ligne: {PublishTime(event.createAt)}</div>
                {
                    event.image ?
                        <img src={event.image} alt="" className='h-[200px] w-[100%] object-cover bg-black' /> :
                        <img src={'/bg/event-bg.jpg'} alt="" className='h-[200px] w-[100%] object-contain' />
                }
                <div className='flex justify-center font-bold items-center pl-3 pr-3 bg-green-600 text-white'>{event.type}</div>
                <div className='m-2 mt-0'>
                    <div className='mb-2 line-clamp-2'>{event.title}</div>
                    <div className='flex justify-between'>
                        {event.comingDate && <div className='text-xs font-bold text-white truncate bg-red-500 rounded p-1 '> <i className='fa-solid fa-calendar'></i> {PublishTime(Timestamp.fromDate(new Date(`${event?.comingDate}T${event?.comingTime}`)))} </div>}
                        {event.online && <div className={`text-white font-bold bg-blue-500 w-[max-content] ${event.comingDate && ""} text-xs p-1 rounded`}> <i class="fa-solid fa-video"></i> En ligne</div>}
                    </div>
                    {event.adress && <div className='mt-2 text-xs text-gray-500 truncate'> <i className='fa-solid fa-location-dot'></i> {event.adress} </div>}
                </div>
            </Link>
        )
    }



    return (
        !events?.length
            ? <div className='flex justify-center items-center h-[80vh]'><h5>Aucun évènement à venir</h5></div>
            :
            <div className='page'>

                <div className="m-2">
                    <h2 className='ml-2'>Evènements</h2>
                    <div className="flex-1 flex flex-wrap">
                        {events.sort((a, b) => b.createAt - a.createAt).map((event) => <Event eventId={event._id}></Event>)}
                    </div>
                </div>
            </div>
    )
}

export default Events