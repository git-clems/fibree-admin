import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";
import Loading from "../components/LoadingPage";
import Page404 from "./404";

const DetailsEvent = () => {
    const [info, setEvent] = useState();
    const { id } = useParams();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await getDocs(collection(db, 'event'));
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                const foundEvent = data.find((e) => e._id === id);
                console.log(response.data);
                setEvent(foundEvent || null);
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
    if (!info) { return <Page404 title={"Evènement non retrouvé"}/> }

    return (
        <div className="page details-page">
            <div className="flex flex-wrap">
                <div className="ml-5 description">
                    <h2 className="name">{info.title}</h2>
                    <p className="text-gray-500">{info.subtitle}</p>
                    {info.comingDate && <span>Date: {info.comingDate} <br /></span>}
                    {info.city && <span className="text-green-600"><i class="fa-solid fa-location-dot"></i>: {info.city}</span>}
                </div>

                <div className="p-4 mt-4 bg-gray-100" style={{ float: 'left' }}>
                    <img src={info.image} alt="" className="
                        rounded-2xl
                        border-1
                        border-gray-300
                        float-right
                        h-[300px]
                        object-cover
                        ml-4 mr-2"/>
                    <p className="ml-2 mr-4 text-justify">{info.description}</p>
                </div>
            </div>
        </div>
    );
};

export default DetailsEvent;