import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";
import Loading from "../components/LoadingPage";
// import Loading from "../components/loadingPage"

const DetailsFlashInfo = () => {
    const [info, setFlashInfo] = useState();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDocs(collection(db, 'envent'));
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                const foundFlashInfo = data.find((e) => e._id === id);
                console.log(response.data);
                setFlashInfo(foundFlashInfo || null);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    while (!info) {
        return <Loading />
    }

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

export default DetailsFlashInfo;