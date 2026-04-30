import { useEffect, useState } from 'react'
import { Link } from 'react-router';
import { db } from '../auth/firebase';
import { collection, getDocs, Timestamp } from 'firebase/firestore';

const Event = ({ eventId }) => {

    const [event, setInfo] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDocs(collection(db, 'event'))
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                setInfo(data.find((e) => e._id === eventId));
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [eventId]);

    while (!event) {
        return (
            <div class="card" aria-hidden="true">
                <div class="card-body">
                    <h5 class="card-title placeholder-glow">
                        <span class="placeholder col-6"></span>
                    </h5>
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-7"></span>
                    </p>
                </div>
            </div>
        );
    }

    // console.log();


    return (
        event.displayed &&
        <Link to={`/evenement/${event._id}`} className="hover:bg-gray-200 flex flew-wrap border-t-1 overflow-hidden border-gray-300 flex-1 p-2">
            <img src={event.image ? event.image : '/bg/event-bg.jpg'} alt="" className={`max-[600px]:hidden w-[98px] h-[98px] object-cover border border-gray-300 rounded-md`} />
            <div className="flex-1 ml-2">
                <span className='font-bold text-orange-500 line-clamp-1'>{event.type}</span>
                <span className='line-clamp-1'>{event.title}</span>
                <div className='flex max-[600px]:hidden justify-between mt-1 flex-wrap'>
                    {event.comingDate && <div className='text-xs mt-1 font-bold text-white truncate bg-red-500 rounded p-1 '> <i className='fa-solid fa-calendar'></i> {Timestamp.fromDate(new Date(event?.comingDate)).toDate().toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} {event.comingTime && `à ${event.comingTime} GMT`}</div>}
                    {event.online && <div className={`text-white mt-1 font-bold bg-blue-500 w-[max-content] text-xs p-1 rounded`}> <i class="fa-solid fa-video"></i> En ligne</div>}
                </div>
                {event.adress && <div className='max-[600px]:hidden text-gray-500 mt-2 text-xs line-clamp-1'> <i className='fa-solid fa-location-dot'></i> {event.adress} </div>}
            </div>
        </Link>
    )
}

export default Event