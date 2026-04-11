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
        <Link to={`/event/${event._id}`} className="">
            <div className='hover:bg-gray-200 flex flew-wrap border-t-1 overflow-hidden border-gray-300 flex-1 p-2'>
                <div className='w-[100px] h-[100px'>
                    <img src={event.image} alt="" className={`${event.image ? 'object-contain border-1 border-gray-300 rounded-md' : ''}`} />
                </div>
                <div className="flex-1 ml-2">
                    <div className='truncate max-w-[300px]'>{event.title}</div>
                    <div className="text-gray-400 truncate max-w-[300px]">{event.subtitle}</div>
                </div>
            </div>
        </Link>
    )
}

export default Event