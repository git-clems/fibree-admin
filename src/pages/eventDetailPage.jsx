import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
            try {
                setLoading(true)
                const snapDoc = await getDoc(doc(db, 'event', id))
                if (snapDoc.exists()) {
                    setEvent({ _id: snapDoc.id, ...snapDoc.data() });
                }else {
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
    if (!event) { return <Page404 message={"Evènement non trouvé"} prev={"Revenir aux évènemts"} prevLink={'/evenement'}/> }

    return (
        <div className="page details-page">
            <div className="flex flex-wrap">
                <div className="ml-5 description">
                    <h4 className="name">{event.title}</h4>
                    <p className="text-gray-500">{event.subtitle}</p>
                    {event.comingDate && <span>Date: {event.comingDate} <br /></span>}
                    {event.city && <span className="text-green-600"><i class="fa-solid fa-location-dot"></i>: {event.city}</span>}
                </div>

                <div className="p-4 mt-4 bg-gray-100" style={{ float: 'left' }}>
                    <img src={event.image} alt="" className="
                        rounded-2xl
                        border-1
                        border-gray-300
                        float-right
                        h-[300px]
                        object-cover
                        ml-4 mr-2"/>
                    <p className="ml-2 mr-4 text-justify">{event.description}</p>
                </div>
            </div>
        </div>
    );
};

export default DetailsEvent;