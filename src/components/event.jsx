import { useEffect, useState } from 'react'
import { Link } from 'react-router';
import { db } from '../auth/firebase';
import { collection, getDocs } from 'firebase/firestore';

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
            {
                event.image ?
                    <img src={event.image} alt="" className={`w-[100px] h-[100px] object-cover border border-gray-300 rounded-md`} /> :
                    <img src={'/bg/event-bg.jpg'} alt="" className={`w-[100px] h-[100px] object-cover border border-gray-300 rounded-md`} />
            }
            <div className="flex-1 ml-2">
                <span className='font-bold text-orange-500'>{event.type}</span>

                <div className=''>{event.title}</div>
                {/* <div className='truncate max-w-[300px]'>{event.title}</div> */}
                {/* <div className="text-gray-400 truncate max-w-[300px]">{event.subtitle}</div> */}

                <div className='flex justify-between mt-1'>
                    {event.comingDate && <div className='text-xs font-bold text-white truncate bg-red-500 rounded p-1 '> <i className='fa-solid fa-calendar'></i> {event.comingDate?.toDate().toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} {event.comingTime && `à ${event.comingTime} GMT`}</div>}
                    {event.online && <div className={`text-white font-bold bg-blue-500 w-[max-content] text-xs p-1 rounded`}> En ligne</div>}
                </div>


                {event.adress && <div className='text-gray-500 mt-2 text-xs truncate'> <i className='fa-solid fa-location-dot'></i> {event.adress} </div>}

            </div>
        </Link>
    )
}

export default Event