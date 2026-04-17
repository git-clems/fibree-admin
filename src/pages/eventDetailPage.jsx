import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import Loading from "../components/LoadingPage";
import Page404 from "./404";

const DetailsEvent = () => {
    const [event, setEvent] = useState();
    const { id } = useParams();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const snapDoc = await getDoc(doc(db, 'event', id))
                if (snapDoc.exists()) {
                    setEvent({ _id: snapDoc.id, ...snapDoc.data() });
                } else {
                    setEvent(null)
                }
            } catch (error) {
                console.log(error);
                setEvent(null)
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <Loading></Loading>
    if (!event) { return <Page404 message={"Evènement non trouvé"} prev={"Revenir aux évènemts"} prevLink={'/evenement'} /> }

    return (
        <div className="page details-page">
            <div className="flex flex-wrap">
                <div className="m-3 w-full bg-gray-200 rounded p-3 max-[600px]:w-full">
                    <p className="name text-xl font-bold"><span className="text-orange-500">{event.type}</span> : {event.title}</p>
                    <p className="text-gray-500">{event.subtitle}</p>
                    <div className='flex'>
                        {event.comingDate && <div className='text-xs font-bold text-white truncate bg-red-500 rounded p-1 '> <i className='fa-solid fa-calendar'></i> {event.comingDate?.toDate().toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} {event.comingTime && `à ${event.comingTime} GMT`}</div>}
                        {event.online && <div className={`ml-2 text-white font-bold bg-blue-500 w-[max-content] ${event.comingDate && ""} text-xs p-1 rounded`}> En ligne</div>}
                    </div>
                    {event.adress && <div className='text-gray-500 mt-2 text-xs truncate'> <i className='fa-solid fa-location-dot'></i> {event.adress} </div>}
                    {event.link && <Link to={event.link} className='' target="_blank"><span className="pl-1 pr-1 bg-yellow-500 underline hover:text-blue-500">{event.linkMessage}</span></Link>}

                    <div className="mt-3 text-xs">
                        Publié le {event.publishDate.toDate().toLocaleString()}
                    </div>
                </div>

                <div className="m-3 max-[600px]:w-full bg-gray-200 p-2 rounded" style={{ float: 'left' }}>
                    <img src={event.image ? event.image : '/bg/event-bg.jpg'} alt="" className="
                        rounded
                        border-1
                        border-gray-300
                        float-right
                        w-[300px]
                        object-cover
                        max-[600px]:w-full
                        min-[600px]:ml-4 min-[600px]:mr-4"/>
                    <div>
                        {event.description.split('\n').map(paragraph => (
                            <p className="ml-2 mr-4 text- first-letter:ml-5">{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsEvent;